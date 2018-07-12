package main
// This is vaper agent.
import (
    "os"
    "encoding/json"
    "strconv"
    log "github.com/sirupsen/logrus"
    "github.com/robfig/cron"
    "github.com/satori/go.uuid"
)


type Actions struct{

}
func check(e error) {
    if e != nil {
        panic(e)
    }
}

//generate a new uid
func (this *Actions) generateUid(config *Config, hostname string) string{
    uuidNew := uuid.NewV5(uuid.NewV1(), hostname).String()
    uuid_path := config.Uuid.Path
    log.Info("The new uuid is : " + uuidNew)
    file, error := os.OpenFile(uuid_path, os.O_RDWR|os.O_CREATE, 0622)
    if error != nil {
        log.Error("Open uuid file in "+ uuid_path +" failed." +  error.Error())
    }
    _,err := file.WriteString(uuidNew)
    if err != nil {
        log.Error("Save uuid file in "+ uuid_path +" failed." +  err.Error())
    }
    file.Close()
    return uuidNew
}

// init host meta info
func (this *Actions) Init( config *Config) bool{
    hostname := getHostname()
    this.generateUid(config, hostname)
    return true
}


//start the agent
func (this *Actions) Start(config *Config){
    uuid_exist := getUuid(config.Uuid.Path)
    if( uuid_exist == "" && config.Uuid.Autogenerate == "1"){
        this.Init(config)
    }
    println("start")
    c := cron.New()

    //host meta job
    hostJob := NewHostJob(config)
    hostInfoFrequency := strconv.Itoa(config.Frequency.HostInfo)

    log.Info("The hostInfoFrequency is :"+ hostInfoFrequency)
    c.AddJob("@every "+ hostInfoFrequency +"s", hostJob)
    host_bt,_ := json.Marshal(getHostMeta(config))
    log.Info("The Host Meta :"+ string(host_bt))

    //network flows job
    networkflowsJob := NewNetworkflowsJob(config)
    networkFlowFrequency :=  strconv.Itoa(config.Frequency.NetworkFlow)

    log.Info("The networkFlowFrequency is :"+ networkFlowFrequency)
    c.AddJob("@every "+ networkFlowFrequency +"s", networkflowsJob)
    log.Info("The Interfaces list :"+ InterfacesToString(getAllInterfaces()))
    
    c.Start()
    
    server_url := config.Server
    log.Info("The server url is : " + server_url)
    println("Running......")

    select{}
}

func checkConfigFile(filepath string)bool{
    file, error := os.OpenFile(filepath, os.O_RDONLY|os.O_CREATE, 0622)
    if error != nil {
        log.Panic("Open config file in "+ filepath +" failed." +  error.Error())
        return false
    }else{
        file.Close()
        return true
    }
}

func main() {
    config := NewConfig()
    config.InitLogger()
    jconfig, _ := json.Marshal(config)
    log.Info("Start configurations:"+string(jconfig))

    checkConfigFile(config.ConfigFilePath)
    
    version := config.Version
    log.Info("VaperAgent - v"+ version + " " + config.Action)
    
    actions := Actions{}
    switch config.Action {
    case "init":
        actions.Init(config)
    case "start":
        actions.Start(config)
    case "nothing" :
        println("vaper_agent doesn't do anything, use -h for help.")
    default:
        println("vaper_agent doesn't do anything, use -h for help.")
    }
}