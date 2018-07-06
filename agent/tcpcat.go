package main

import (
    "strconv"
    "github.com/google/gopacket"
    "github.com/google/gopacket/pcap"
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
    for k, interf := range interfaces {
        logrus.Debug("Interface " +strconv.Itoa(k)+":"+interf.Name)
    }
    return interfaces
}
func InterfacesToString(interfaces []net.Interface) string{
    var result string = ""
    for _,itf := range interfaces {
        result += itf.Name + " , "
    }
    return result
}

func getPkgsByDeviceName(deviceName string, networkflows chan []gopacket.Flow, limit int, timeoutSecond int ){
    var (
        snapshot_len int32  = 1024
        promiscuous  bool   = false
        err          error
        timeout      time.Duration = time.Duration(timeoutSecond) * time.Second
        handle       *pcap.Handle
        nwfs [] gopacket.Flow
    )
    handle, err = pcap.OpenLive(deviceName, snapshot_len, promiscuous, timeout)
    if err == nil {
        defer handle.Close()
        count := 0
        packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
        for {
            packet, err := packetSource.NextPacket()
            if err == io.EOF {
                break
            } else if err != nil {
                logrus.Debug("Interface "+ deviceName + ": No more packages." + err.Error())
                break
            }
            applicationLayer := packet.NetworkLayer()
            if applicationLayer != nil{
                flow := applicationLayer.NetworkFlow()
                nwfs = append(nwfs, flow)
            }
            count += 1
            if count > limit{
                logrus.Debug("Interface "+ deviceName + ":catch "+ strconv.Itoa(count) +" package.")
                break
            }
        }
    }
    networkflows <- nwfs
}

func tcpcatch (limit int,timeoutSecond int) [] gopacket.Flow{
    var(
        networkflowsCh chan []gopacket.Flow = make(chan []gopacket.Flow)
    )
    interfaces := getAllInterfaces()
    for _,v := range interfaces {
        go getPkgsByDeviceName(v.Name, networkflowsCh, limit, timeoutSecond)
    }

    var networkflows [] gopacket.Flow
    for i := 0; i < len(interfaces); i++ {
        flows := <- networkflowsCh
        networkflows = append(networkflows, flows...)
    }
    return networkflows
}
