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

    LogLevel string `default:"info"`
    LogPath string `default:"./vaper_agent.log"`

    Frequency struct{
        HostInfo int `default: 60`
        NetworkFlow int `default: 10`
    }

    Sampling struct{
        Rate float64 `default: 0.1`
    }
        
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

    //log level
    flag.StringVar(&config.LogLevel, "loglevel", "info", "Log level: debug info warn error fatal panic")
 
    //log path
    flag.StringVar(&config.LogPath, "logpath", "./vaper_agent.log", "Log path")
    
    os.Setenv("CONFIGOR_ENV_PREFIX", "-")
    flag.Parse()

    configor.Load(&config, *fconfig)
    
    //check
    if config.Sampling.Rate > 1.0{
        config.Sampling.Rate = 1.0
    }else if config.Sampling.Rate < 0.1 {
        config.Sampling.Rate = 0.1
    }
    
    //check config ,fix HostInfo = 0 when configitem is a int.
    if config.Frequency.HostInfo < 60{
        config.Frequency.HostInfo = 60
    }
    if config.Frequency.NetworkFlow < 10 {
        config.Frequency.NetworkFlow = 10
    }

    return &config
}

func (config *Config) InitLogger(){
    level := strings.ToLower(config.LogLevel)
    logpath := config.LogPath
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
