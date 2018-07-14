package main
import (
    "strings"
    "io/ioutil"
    "net/http"
    "encoding/json"
    "time"
    log "github.com/sirupsen/logrus"
    "strconv"
)
/* 
type Flow struct{
    SrcIp string
    DstIp string
    Count int
}
 */
type NetworkFlowMsg struct{
    Uid string
    NetworkFlows []TcpFlow
    UnixTime int64
}

func NewNetworkFlowMsg(uid string,networkFlows []TcpFlow) *NetworkFlowMsg{
    networkFlowMsg := NetworkFlowMsg{}
    networkFlowMsg.Uid = uid
    networkFlowMsg.NetworkFlows = networkFlows
    networkFlowMsg.UnixTime = time.Now().Unix()

    return &networkFlowMsg
}
/* 
type TcpFlow{
    SrcIp String
    DstIp String

    SrcPort int
    DstPort int
    Count int
}
 */
// need test
// the flow has direction so ...
func (flow *TcpFlow) IsEqual(flow_t TcpFlow)bool{
    if(flow.SrcIp ==  flow_t.SrcIp && flow.DstIp ==  flow_t.DstIp && flow.SrcPort ==  flow_t.SrcPort && flow.DstPort ==  flow_t.DstPort ){
        return true
    }
    if(flow.SrcIp ==  flow_t.DstIp && flow.DstIp ==  flow_t.SrcIp && flow.SrcPort ==  flow_t.DstPort && flow.DstPort ==  flow_t.SrcPort ){
        return true
    }
    return false
}

// need test
func flowIndexOf(dcFlows []TcpFlow , tgFlow TcpFlow) int{
    for index,flow := range dcFlows{
        if(tgFlow.IsEqual(flow)){
            return index
        }
    }
    return -1
}

// need test
func flowsDistinctCount(tcpFlows []TcpFlow) []TcpFlow{
    var dcFlows []TcpFlow
    for _,flow := range tcpFlows{
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
func flowsSpeedCompute(tcpFlows []TcpFlow, durationUnixNano int64) []TcpFlow{
    for index,flow := range tcpFlows{
        count := flow.Count
        count_f := float64(count)
        durationUnixNano_f := float64(durationUnixNano)
        tcpFlows[index].PackagesPerSecond = count_f/durationUnixNano_f * 1000000000            
        log.Debug("Catch "+ strconv.Itoa(count) + ";durationUnixNano_f: "+ strconv.FormatFloat(durationUnixNano_f, 'f', 3, 64) + ";count_f: "+strconv.FormatFloat(count_f, 'f', 3, 64)+";Tps = " + strconv.FormatFloat(tcpFlows[index].PackagesPerSecond, 'f', 3, 64) + " packages/s;")
    }

    return tcpFlows
} 

func getNetworkFlowMsg(config *Config) *NetworkFlowMsg{

    tcpFlows, durationUnixNano := tcpcatch(config.Frequency.NetworkFlow, config.Sampling.Rate)

    uid := getUuid(config.Uuid.Path)
    dcFlows := flowsDistinctCount(tcpFlows)
    dcFlows = flowsSpeedCompute(dcFlows, durationUnixNano)


    return NewNetworkFlowMsg(uid, dcFlows)
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
        log.Debug("0 data was catched during this round.")
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
    client := &http.Client{}
    // client.Timeout = time.Duration(2) * time.Second 

    payload := strings.NewReader(msg)
    req, _ := http.NewRequest("POST", url, payload)
    req.Header.Add("content-type", "application/json")
    log.Debug("Post message to "+ url + ";request.body:"+ msg);

    res, err := client.Do(req)
    if(err != nil){
        log.Error("send msg info fail.detail:" + err.Error())
        return false
    }else{
        defer res.Body.Close()
        body, err := ioutil.ReadAll(res.Body)
        if err != nil{
            log.Error("send msg info fail.detail:" + err.Error())
            return false
        }else{
            log.Debug("response:" + string(body))
            return true
        }
    }
}
