package stepper

import (
	"os"
	"testing"
	"time"

	"github.com/stianeikeland/go-rpio"
)

func TestSetup(t *testing.T) {
	var (
		s *Stepper
	)
	s = Setup(1, [4]uint8{2, 3, 4, 17}, 1600)

	t.Log(s)
}

func TestMove(t *testing.T) {
	var (
		err error
		s   *Stepper
	)
	if err = rpio.Open(); err != nil {
		os.Exit(-1)
	}

	s = Setup(1, [4]uint8{2, 3, 4, 17}, 1600)

	start := time.Now()
	if err = s.Move(60, 2, Forward); err != nil {
		return
	}
	end := time.Now()

	t.Log(end.Sub(start))
}

func TestHalt(t *testing.T) {
	var (
		err error
		s   *Stepper
	)
	if err = rpio.Open(); err != nil {
		os.Exit(-1)
	}

	s = Setup(1, [4]uint8{2, 3, 4, 17}, 1600)

	go func() {
		time.Sleep(10000)
		s.Halt()
	}()

	if err = s.Move(60, 2, Forward); err != nil {
		return
	}
}
