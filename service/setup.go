package service

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/mintxtinm/biodim/stepper"
	"github.com/mintxtinm/biodim/utils"
)

var stepList = [][4]uint8{
	{2, 3, 4, 17},
	{27, 22, 10, 9},
	{11, 0, 5, 6},
	{14, 15, 18, 23},
	{24, 25, 8, 7},
}

// Instance - Service instance
type Instance struct {
	steppers []*stepper.Stepper
}

// Setup - Init API service
func Setup() *mux.Router {
	var (
		ins Instance
	)

	// Init stepper
	for i, step := range stepList {
		ins.steppers = append(ins.steppers, stepper.Setup(i, step, 1600))
	}

	r := mux.NewRouter().StrictSlash(true).PathPrefix("/api").Subrouter()
	r.HandleFunc("/step/move", ins.handleStepMove).Methods("POST")
	r.HandleFunc("/step/halt", ins.handleStepHalt).Methods("POST")

	return r
}

func (ins *Instance) handleStepMove(w http.ResponseWriter, r *http.Request) {
	type form struct {
		ID        int               `json:"ID"`
		Speed     float64           `json:"speed"`
		Distance  uint              `json:"distance"`
		Direction stepper.Direction `json:"direction"`
	}

	var err error
	f := form{}
	if err = json.NewDecoder(r.Body).Decode(&f); err != nil {
		utils.RespondWithError(w, http.StatusForbidden, "params error")
		return
	}

	go func() {
		if err = ins.steppers[f.ID].Move(f.Speed, f.Distance, f.Direction); err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "stepper error")
			return
		}
	}()

	utils.RespondWithJSON(w, http.StatusOK, map[string]interface{}{
		"msg": "success",
	})
	return
}

func (ins *Instance) handleStepHalt(w http.ResponseWriter, r *http.Request) {
	type form struct {
		ID int `json:"ID"`
	}

	var err error
	f := form{}
	if err = json.NewDecoder(r.Body).Decode(&f); err != nil {
		utils.RespondWithError(w, http.StatusForbidden, "params error")
		return
	}

	ins.steppers[f.ID].Halt()

	utils.RespondWithJSON(w, http.StatusOK, map[string]interface{}{
		"msg": "success",
	})
	return
}
