package main
/* This is a config file configure read function */
import (
    "os"
    "strings"
    "flag"
    log "github.com/sirupsen/logrus"
    "github.com/jinzhu/configor"
)

type Config struct {

    Version string `default:"1.0.0"`

    Action string `default:"nothing"`

    ConfigFilePath string `default:"./config.yml"`
    
    Uuid struct{
        Path string `default:"./vaper_agent.uid"`
        Autogenerate string `default:"1"`
    }

    Log struct{
        Level string `default:"info"`
    
        Path string `default:"./vaper_agent.log"`
    }

    Frequency struct{
        HostInfo string `default:"60"`
        NetworkFlow string `default:"10"`
    }
    
    PackagesLimit string `default:"10"`
    
    Server string `default:"http://127.0.0.1:3000"`

    Api struct{        
        HostAdd string `default:"/host/add_or_update"`
        NetflowAdd string `default:"/netflow/add"`
    }
    

}

func NewConfig () *Config{
    
    fconfig := flag.String("f", "./config.yml", "configuration file")
    
    config := Config{}
    // action
    flag.StringVar(&config.Action,"a", "nothing", "action: init/start")
    
    //ServerUrl
    flag.StringVar(&config.Server, "ServerUrl", "http://127.0.0.1:3000", "ServerUrl")
    
    os.Setenv("CONFIGOR_ENV_PREFIX", "-")
    flag.Parse()

    configor.Load(&config, *fconfig)
    
    return &config
}

func (config *Config) InitLogger(){
    level := strings.ToLower(config.Log.Level)
    logpath := config.Log.Path
    file, err := os.OpenFile(logpath, os.O_CREATE|os.O_WRONLY, 0666)
    if err == nil {
        log.SetOutput(file)
    } else {
        log.Error("Failed to log to file:"+logpath)
    }
    switch {
        case level == "debug":
            log.SetLevel(log.DebugLevel)
        case level == "info":
            log.SetLevel(log.InfoLevel)
        case level == "warn":
            log.SetLevel(log.WarnLevel)
        case level == "error":
            log.SetLevel(log.ErrorLevel)
        case level == "fatal":
            log.SetLevel(log.FatalLevel)
        case level == "panic":
            log.SetLevel(log.PanicLevel)
        default:
            log.SetLevel(log.ErrorLevel)
    }
    log.Info("Log output to :"+logpath)
    log.Info("Log Level is :"+level)

    log.Info("Config file path is :"+config.ConfigFilePath )
}

func PathExists(path string) (bool, error) {
    _, err := os.Stat(path)
    if err == nil {
        return true, nil
    }
    if os.IsNotExist(err) {
        return false, nil
    }
    return false, err
}
