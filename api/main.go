package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/mintxtinm/biodim/service"
	"github.com/stianeikeland/go-rpio"
)

func main() {
	var (
		err error
	)

	if err = rpio.Open(); err != nil {
		os.Exit(-1)
	}

	router := service.Setup()

	fmt.Println("Service started at :9090")
	log.Fatal(http.ListenAndServe(":9090", router))
}
