package main

import (
    "github.com/google/gopacket"
    "github.com/google/gopacket/pcap"
    "github.com/google/gopacket/layers"
    "time"
    "io"
    logrus "github.com/sirupsen/logrus"
    "net"
)

// get all net interfaces
func getAllInterfaces() []net.Interface {
    //Get all interface info
    interfaces,err := net.Interfaces()
    if err != nil{
        logrus.Fatal("Failed to get the interfaces info.")
    }
    interfacesStr := ""
    for _, interf := range interfaces {
        interfacesStr += interf.Name + ";"
    }
    logrus.Debug("Found interfaces: " + interfacesStr )
    return interfaces
}
func InterfacesToString(interfaces []net.Interface) string{
    var result string = ""
    for _,itf := range interfaces {
        result += itf.Name + " , "
    }
    return result
}

type TcpFlow struct{
    SrcIp string
    DstIp string

    SrcPort int
    DstPort int

    ProcessName string
    PackagesPerSecond float64
    Count int
}

func NewTcpFlow(SrcIp string, DstIp string, SrcPort int, DstPort int)* TcpFlow{
    tcpFlow := TcpFlow{}
    
    tcpFlow.SrcIp = SrcIp
    tcpFlow.DstIp = DstIp

    tcpFlow.SrcPort = SrcPort
    tcpFlow.DstPort = DstPort
    tcpFlow.PackagesPerSecond = 0.1
    tcpFlow.Count = 0
    tcpFlow.ProcessName = ""

    return &tcpFlow
}

func getPkgsByDeviceName(deviceName string, networkflows chan []TcpFlow, timeoutSecond int ){
    var (
        snapshot_len int32  = 1024
        promiscuous  bool   = false
        err          error
        timeout      time.Duration = time.Duration(timeoutSecond) * time.Second
        handle       *pcap.Handle
        nwfs []TcpFlow
    )
    handle, err = pcap.OpenLive(deviceName, snapshot_len, promiscuous, timeout)
    if err == nil {
        defer handle.Close()

        packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
        for {
            packet, err := packetSource.NextPacket()
            if err == io.EOF {
                break
            } else if err != nil {
                logrus.Debug("Interface "+ deviceName + ": catch 0 packages." + err.Error())
                break
            }

            SrcPort := 0
            DstPort := 0

            tcpLayer := packet.Layer(layers.LayerTypeTCP)
            if tcpLayer != nil{
                tcp, _ := tcpLayer.(*layers.TCP)
                SrcPort = int(tcp.SrcPort)
                DstPort = int(tcp.DstPort)
                if SrcPort < DstPort{
                    DstPort = -1
                }else{
                    SrcPort = -1
                }
            }
            
            applicationLayer := packet.NetworkLayer()
            if applicationLayer != nil{
                flow := applicationLayer.NetworkFlow()
                tpcFlow := NewTcpFlow(flow.Src().String(), flow.Dst().String(), SrcPort, DstPort)
                nwfs = append(nwfs, *tpcFlow)
            }
        }
    }

    networkflows <- nwfs
}

func tcpcatch (frequency int, rate float64) ( []TcpFlow, int64){
    var(
        networkflowsCh chan []TcpFlow = make(chan []TcpFlow)
        timeoutSecond int = int(float64(frequency) * rate)
    )
    interfaces := getAllInterfaces()
    startTimeUnixNano := time.Now().UnixNano()

    for _,v := range interfaces {
        go getPkgsByDeviceName(v.Name, networkflowsCh, timeoutSecond)
    }

    var networkflows [] TcpFlow
    for i := 0; i < len(interfaces); i++ {
        flows := <- networkflowsCh
        networkflows = append(networkflows, flows...)
    }

    endTimeUnixNano := time.Now().UnixNano()
    durationUnixNano := endTimeUnixNano - startTimeUnixNano

    return networkflows, durationUnixNano
}
