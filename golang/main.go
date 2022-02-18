package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"main/structs"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func main() {
	// fmt.Println(getCPU())
	// fmt.Println(getMemory())
	// fmt.Println(getCpuUsage())
	makeServer()
}

func makeServer() {
	router := mux.NewRouter().StrictSlash(true)
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "DELETE", "PUT"})
	origins := handlers.AllowedOrigins([]string{"*"})
	port := os.Getenv("PORT")
	if port == "" {
		port = "4200"
	}
	router.HandleFunc("/", welcome).Methods("GET")
	router.HandleFunc("/ram", socketMemory)
	router.HandleFunc("/cpu", socketCpu)
	router.HandleFunc("/kill", killProcess).Methods("POST")
	router.HandleFunc("/loadCpu", loadCpu).Methods("GET")
	fmt.Println("server up in " + port + " port")
	http.ListenAndServe(":"+port, handlers.CORS(headers, methods, origins)(router))
}

func welcome(response http.ResponseWriter, request *http.Request) {
	response.Write([]byte("Hello from Go api"))
}

func loadCpu(response http.ResponseWriter, request *http.Request) {
	numero := 123
	for i := 0; i < 100; i++ {
		numero = numero + numero
	}
	response.Write([]byte("exito"))
}

func readerCPU(connection *websocket.Conn) {
	for {
		messageType, p, err := connection.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		log.Println(string(p))

		if err := connection.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}

func readerRam(connection *websocket.Conn) {
	for {
		messageType, p, err := connection.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		log.Println(string(p))

		if err := connection.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}

func writerRam(connection *websocket.Conn) {
	for {
		data := getMemory()
		if err := connection.WriteJSON(data); err != nil {
			log.Println(err)
			return
		}
		time.Sleep(1000 * time.Millisecond)
	}
}

func writerCpu(connection *websocket.Conn) {
	for {
		data := getCPU()
		if err := connection.WriteJSON(data); err != nil {
			log.Println(err)
			return
		}
		time.Sleep(1000 * time.Millisecond)
	}
}

func socketMemory(response http.ResponseWriter, request *http.Request) {
	upgrader.CheckOrigin = func(request *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(response, request, nil)
	if err != nil {
		log.Println(err)
	}
	log.Println("Client connected to RAM")
	writerRam(ws)
	log.Println("Client disconected to RAM")
}

func socketCpu(response http.ResponseWriter, request *http.Request) {
	upgrader.CheckOrigin = func(request *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(response, request, nil)
	if err != nil {
		log.Println(err)
	}
	log.Println("Client conected to CPU")
	writerCpu(ws)
	log.Println("Client disconected to CPU")
}

func getCpuUsage() float64 {
	cmd := exec.Command("sh", "-c", `ps -eo pcpu | sort -k 1 -r | head -50`)
	stdout, err := cmd.Output()
	if err != nil {
		fmt.Println("error al correr comando", err)
	}
	salidaAuxiliar := strings.Split(string(stdout), "\n")
	var total float64 = 0
	for i := 0; i < len(salidaAuxiliar); i++ {
		float1, _ := strconv.ParseFloat(salidaAuxiliar[i], 64)
		total += float1
	}
	total = (total / float64(len(salidaAuxiliar)-43))
	return (total)
}

func getCache() float64 {
	cmd := exec.Command("sh", "-c", `free -m | head -n2 | tail -1 | awk '{print $6}'`)
	stdout, err := cmd.Output()
	if err != nil {
		fmt.Println("error al correr comando", err)
	}
	salida := strings.Trim(strings.Trim(string(stdout), " "), "\n")
	valor, _ := strconv.ParseFloat(salida, 64)
	return valor
}

func getMemory() structs.Memoria {
	ram, _ := ioutil.ReadFile("/proc/memo_201900289")
	var memoria structs.Memoria
	json.Unmarshal(ram, &memoria)
	memoria.Cache_memory = getCache()
	memoria.Used_memory = (memoria.Total_memory - memoria.Free_memory - int(getCache())) * 100 / memoria.Total_memory
	memoria.Available_memory = memoria.Free_memory + int(getCache())
	memoria.MB_memory = (memoria.Total_memory - memoria.Free_memory - int(getCache()))
	return memoria
}

func getCPU() structs.CpuSend {
	processes, _ := ioutil.ReadFile("/proc/cpu_201900289")
	var cpu structs.Cpu
	var cpuSend structs.CpuSend
	json.Unmarshal(processes, &cpu)
	cpu.Usage = getCpuUsage()
	hashmap := make(map[int]string)
	var keys []int
	for i := 0; i < len(cpu.Processes); i++ {
		inputProcess := cpu.Processes[i]
		if !contains(keys, inputProcess.User) {
			keys = append(keys, inputProcess.User)
			hashmap[inputProcess.User] = getUser(inputProcess.User)
		}
		auxiliar := structs.ProcessSend{Pid: inputProcess.Pid, Name: inputProcess.Name, User: hashmap[inputProcess.User], State: inputProcess.State, Ram: inputProcess.Ram, Child: inputProcess.Child}
		cpuSend.Processes = append(cpuSend.Processes, auxiliar)
	}
	cpuSend.Running = cpu.Running
	cpuSend.Sleeping = cpu.Sleeping
	cpuSend.Stopped = cpu.Stopped
	cpuSend.Total = cpu.Total
	cpuSend.Usage = cpu.Usage
	cpuSend.Zombie = cpu.Zombie
	return cpuSend
}

func getUser(nombre int) string {
	cmd := exec.Command("sh", "-c", `id -nu `+strconv.Itoa(nombre))
	stdout, err := cmd.Output()
	if err != nil {
		fmt.Println("error al correr comando", err)
	}
	salida := strings.Trim(strings.Trim(string(stdout), " "), "\n")
	return salida
}

func killProcess(response http.ResponseWriter, request *http.Request) {
	data, errRead := ioutil.ReadAll(request.Body)
	fmt.Println("kill process")
	if errRead != nil {
		fmt.Println("error al eliminar un proceso")
		response.Write([]byte("{\"value\": false"))
	}
	fmt.Println(string(data))
	cmd := exec.Command("sh", "-c", `kill `+string(data))
	stdout, err := cmd.Output()
	if err != nil {
		fmt.Println("error al correr comando", err)
	}
	salida := strings.Trim(strings.Trim(string(stdout), " "), "\n")
	fmt.Println(salida)
	response.Write([]byte("{\"value\": true"))

}

func contains(s []int, e int) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
