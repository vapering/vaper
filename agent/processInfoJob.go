package main
import (
    log "github.com/sirupsen/logrus"
    "strconv"
    "github.com/vapering/GOnetstat"
)

func stringSliceToMap(slice []string)(map[string]struct{}){
    tmap := make(map[string] struct{})
    for _,item := range slice{
        tmap[item] = struct{}{}
    }
    return tmap
}


type ProcessNetInfo struct{
    Ips map[string]struct{}
    ProcessPorts map[int]string
}

func NewProcessNetInfo()ProcessNetInfo{
    processNetInfo := ProcessNetInfo{}
    ips := get_internal_ips()
    ips_map := stringSliceToMap(ips)

    processNetInfo.Ips = ips_map
    processNetInfo.ProcessPorts= getProcessPortMap()

    return processNetInfo
}

func getProcessPortMap() map[int] string{

    processPortMap := map[int]string{}
    d := GOnetstat.Tcp()
    for _, p := range(d) {
        if p.State == "LISTEN" {
            tport := int(p.Port)
            processPortMap[tport] = p.Name
            log.Debug("Process pid: "+p.Pid +"; exe:"+p.Exe+"; name:"+p.Name+"; listen on: "+strconv.Itoa(tport))
        }
    }
    return processPortMap
}

func generateProcessNetInfo(processNetInfoChan chan ProcessNetInfo, num int){
    newProcessNetInfo := NewProcessNetInfo()
    for index := 0; index < num; index++ {
        processNetInfoChan <- newProcessNetInfo
    }
}

