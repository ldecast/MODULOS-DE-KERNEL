package structs

type Prueba struct {
	Nombre string
	Edad   int
}

type Memoria struct {
	Total_memory     int     `json: "total_memory"`
	Free_memory      int     `json: "free_memory"`
	Used_memory      int     `json: "used_memory"`
	Cache_memory     float64 `json: "cache_memory"`
	Available_memory int     `json: "available_memory"`
	MB_memory        int     `json: "mb_memory"`
}

type Process struct {
	Pid   int      `json: "pid"`
	Name  string   `json: "name"`
	User  int      `json: "user"`
	State int      `json: "state"`
	Ram   int      `json: "ram"`
	Child []Childs `json: "child"`
}

type Cpu struct {
	Processes []Process `json: "processes"`
	Running   int       `json: "running"`
	Sleeping  int       `json: "sleeping"`
	Zombie    int       `json: "zombie"`
	Stopped   int       `json: "stopped"`
	Total     int       `json: "total"`
	Usage     float64   `json: "usage"`
}

type ProcessSend struct {
	Pid   int      `json: "pid"`
	Name  string   `json: "name"`
	User  string   `json: "user"`
	State int      `json: "state"`
	Ram   int      `json: "ram"`
	Child []Childs `json: "child"`
}

type Childs struct {
	Pid  int    `json: "pid"`
	Name string `json: "name"`
}

type CpuSend struct {
	Processes []ProcessSend `json: "processes"`
	Running   int           `json: "running"`
	Sleeping  int           `json: "sleeping"`
	Zombie    int           `json: "zombie"`
	Stopped   int           `json: "stopped"`
	Total     int           `json: "total"`
	Usage     float64       `json: "usage"`
}
