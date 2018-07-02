package main
import (
    "strings"
    "io/ioutil"
    "net/http"
    "encoding/json"
    log "github.com/sirupsen/logrus"
    "github.com/google/gopacket"
)

type Flow struct{
    SrcIp string
    DstIp string
    Count int
}

type NetworkFlowMsg struct{
    Uid string
    NetworkFlows []Flow
}

// need test
// the flow has no direction so ...
func (flow *Flow) IsEqual(flow_t Flow)bool{
    if(flow.SrcIp ==  flow_t.SrcIp && flow.DstIp ==  flow_t.DstIp ){
        return true
    }
    if(flow.SrcIp ==  flow_t.DstIp && flow.DstIp ==  flow_t.SrcIp ){
        return true
    }
    return false
}

// need test
func flowIndexOf(dcFlows []Flow , tgFlow Flow) int{
    for index,flow := range dcFlows{
        if(tgFlow.IsEqual(flow)){
            return index
        }
    }
    return -1
}

// need test
func flowsDistinctCount(flows []Flow) []Flow{
    var dcFlows []Flow
    for _,flow := range flows{
        index := flowIndexOf(dcFlows, flow)
        if(index != -1){
            dcFlows[index].Count += 1
        }else{
            flow.Count = 1
            dcFlows = append(dcFlows, flow)
        }
    }
    return dcFlows
} 

func getNetworkFlowMsg(config *Config) NetworkFlowMsg{
    var(
        networkFlows []gopacket.Flow = tcpcatch(10, 10)
        networkFlowMsg NetworkFlowMsg
        flows []Flow
    )
    for _,netflow := range networkFlows{
        flow := Flow{}
        flow.SrcIp = netflow.Src().String()
        flow.DstIp = netflow.Dst().String()
        flow.Count = 0
        flows = append(flows, flow)
    }

    networkFlowMsg.Uid = getUuid(config.Uuid.Path)
    dcFlows := flowsDistinctCount(flows)
    networkFlowMsg.NetworkFlows = dcFlows
    return networkFlowMsg
}

type NetworkflowsJob struct{
    config *Config
} 

func NewNetworkflowsJob (config *Config) NetworkflowsJob{
    networkflowsJob := NetworkflowsJob{}
    networkflowsJob.config = config
    return networkflowsJob
}

func (this NetworkflowsJob)Run(){
    nwfMsg := getNetworkFlowMsg(this.config)
    if nwfMsg.NetworkFlows == nil{
        log.Debug("No flow data was catched.")
        return
    }else{
        server_url := this.config.Server
        netflow_add_url := server_url + this.config.Api.NetflowAdd
        msg_bt,_ := json.Marshal(nwfMsg)
        msg_str := string(msg_bt)
        postMsg(netflow_add_url, msg_str)
    }
}

func postMsg(url string, msg string) bool {
    payload := strings.NewReader(msg)
    req, _ := http.NewRequest("POST", url, payload)
    req.Header.Add("content-type", "application/json")
    res, err := http.DefaultClient.Do(req)
    if(err != nil){
        log.Error("send msg info fail.detail:"+err.Error())
        return false
    }else{
        defer res.Body.Close()
        body, _ := ioutil.ReadAll(res.Body)
        log.Debug(url + ";request:"+ msg +";response:" + string(body))
        return true
    }
}
