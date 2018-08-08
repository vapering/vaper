# Agent

[Documentation](https://vapering.github.io/vaper/#/)  
Agent 是一个golang开发的客户端程序，从操作系统采集网络流量、hostname、进程信息。


## 运行

`./vaper_agent -a start`

## vaper_agent的命令行参数:
```
  -LogLevel string
        Log level: debug info warn error fatal panic (default "info")
  -LogPath string
        Log path (default "./vaper_agent.log")
  -ServerUrl string
        ServerUrl (default "http://127.0.0.1:3000")
  -a string
        action: init/start (default "nothing")
  -f string
        configuration file (default "./config.yml")
```

> 除了在容器中，大多数情况下vaper_agent需要root权限来收集信息；    
> 在容器中vaper_agent一般和程序的运行账号相同，否则agent可能无法采集进程信息;  

## vaper_agent使用示例

```bash
curl -o vaper_agent https://github.com/vapering/vaper/releases/download/v0.0.1/vaper_agent
chmod +x ./vaper_agent
nohup ./vaper_agent -a start >>./vaper_agent.log 2>&1 &
```

## 在开发环境编译和运行

`sh buildRun.sh`  
编译的输出是 vaper_agent

## 静态编译
确保已经在操作系统上安装了 glibc-static.x86_64  
`yum install glibc-static -y`   
`go build -o vaper_agent -ldflags '-linkmode "external" -extldflags "-static"'`





    
<!-- 

## Something More

Vaper-agent need `libpcap` in the development environment. Nobody want to waste time in install libpcap on every host. So we need to make sure that  compiling the vaper_agent statically.

- Find (`#cgo linux LDFLAGS: -lpcap`) in file (pcap.go), and change to something like (`#cgo linux LDFLAGS: -L /tmp/nginx/libpcap-1.8.1 -lpcap`)
- another place glibc

### How to compile libpcap statically
```shell
$ wget http://www.tcpdump.org/release/libpcap-1.8.1.tar.gz
$ tar xzf libpcap-1.8.1.tar.gz && cd libpcap-1.8.1
$ ./configure && make
$ find -name "libpcap.so*" -o -name "libpcap.a"
./libpcap.a
./libpcap.so.1.2.0
``` 

-->