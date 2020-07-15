package stepper

import (
	"sync"
	"time"

	"github.com/stianeikeland/go-rpio"
)

var phaseMatrix = [4][4]int{
	{1, 0, 1, 0},
	{0, 1, 1, 0},
	{0, 1, 0, 1},
	{1, 0, 0, 1},
}

// Direction - Direction type
type Direction int

const (
	// Forward - Direction = 1
	Forward Direction = 1
	// Reverse - Direction = -1
	Reverse = -1
)

// Stepper - Stepper object
type Stepper struct {
	ID   int
	pins [4]uint8
	spr  uint // Steps per revolution

	// Dynamic
	speed     float64   // Revolutions per minute
	distance  uint      // Millimeters
	direction Direction // Forward = 1, Reverse = -1
	running   bool

	mutex *sync.Mutex
}

// Setup - Init a stepper
func Setup(ID int, pins [4]uint8, spr uint) (s *Stepper) {
	return &Stepper{
		ID:    ID,
		pins:  pins,
		spr:   spr,
		mutex: &sync.Mutex{},
	}
}

// Move - Move stepper
func (s *Stepper) Move(speed float64, distance uint, direction Direction) (err error) {
	var (
		stepsLeft  uint = 0
		stepNumber uint = 0
	)

	// halt before alter speed
	if s.running == true {
		s.Halt()
	}

	totalSteps := (distance / 2) * 1600
	delay := time.Duration(60*1000*1000/(float64(s.spr)*speed)) * time.Microsecond

	s.mutex.Lock()
	s.speed = speed
	s.distance = distance
	s.direction = direction
	s.running = true
	s.mutex.Unlock()

	stepsLeft = totalSteps
	for stepsLeft > 0 {
		// Halt signal
		if s.running == false {
			break
		}

		switch direction {
		// Forward
		case Forward:
			stepNumber++
			if stepNumber == totalSteps {
				stepNumber = 0
			}

		// Reverse
		case Reverse:
			if stepNumber == 0 {
				stepNumber = totalSteps
			}
			stepNumber--
		}

		stepsLeft--

		if err = s.step(int(stepNumber) % 4); err != nil {
			return
		}

		time.Sleep(delay)
	}

	return
}

func (s *Stepper) step(phase int) (err error) {
	for i := range []int{0, 1, 2, 3} {
		if phaseMatrix[phase][i] == 1 {
			rpio.Pin(s.pins[i]).High()
		} else {
			rpio.Pin(s.pins[i]).Low()
		}
	}

	return
}

// Halt - Halt stepper
func (s *Stepper) Halt() {
	s.mutex.Lock()
	s.running = false
	s.mutex.Unlock()
	return
}
