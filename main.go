package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/gorilla/mux"
)

var root string

type song struct {
	Name string `json:"name"`
}

type songs struct {
	Songs []song `json:"songs"`
}

func songsHandler(w http.ResponseWriter, r *http.Request) {
	var songsArr []song
	files, err := ioutil.ReadDir(root)
	if err != nil {
		fmt.Println("Could not read directory:", err)
		return
	}

	for _, file := range files {
		s := song{file.Name()}
		if s.Name[0] != '.' {
			songsArr = append(songsArr, s)
		}
	}

	err = json.NewEncoder(w).Encode(songs{songsArr})
	if err != nil {
		fmt.Println("Could not encode the struct into JSON:", err)
		return
	}
}

func songHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	path := path.Join(root, vars["song"])

	http.ServeFile(w, r, path)
}

func main() {
	port := flag.String("port", "3000", "port to run the application on")
	rt := flag.String("root", "", "directory to get music files from")
	flag.Parse()
	if *rt == "" {
		goPlayRoot := os.Getenv("GOPLAYROOT")
		if goPlayRoot == "" {
			fmt.Println("\tPlease provide the root directory through the root flag")
			fmt.Printf("\tor by setting GOPLAYROOT environment variable.\n\n")
			fmt.Println("\tEnter goplay -h for help")
			return
		}
		root = goPlayRoot
	} else {
		root = *rt
	}

	gopath := os.Getenv("GOPATH")

	staticPath := gopath + "/src/github.com/anarchyrucks/goplay/static"

	r := mux.NewRouter()

	r.HandleFunc("/songs", songsHandler)
	r.HandleFunc("/songs/{song}", songHandler)
	r.PathPrefix("/").Handler(http.FileServer(http.Dir(staticPath)))
	http.Handle("/", r)

	addr, _ := net.InterfaceAddrs()
	addrString := net.Addr.String(addr[3])
	ip := strings.Split(addrString, "/")[0]

	fmt.Printf("Running at http://localhost:%s\n", *port)
	fmt.Printf("LAN Address: http://%s:%s\n", ip, *port)

	err := http.ListenAndServe(":"+*port, nil)
	if err != nil {
		fmt.Println("Could not start the server:", err)
		return
	}
}
