package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// RespondWithError with status code & message
func RespondWithError(w http.ResponseWriter, code int, message string) {
	RespondWithJSON(w, code, map[string]string{
		"msg":   "error",
		"error": message})
}

// RespondWithJSON with status code & data
func RespondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, marErr := json.Marshal(payload)
	// LogInfo("respond-1")
	if marErr != nil {
		fmt.Println(marErr.Error())
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}
