# Agent

[Documentation](https://vapering.github.io/vaper/#/)  
Agent is a golang program. Collect netflow data and hostmeta info from operating system.  


## Run

`./vaper_agent -a start`

## Usage of vaper_agent:
```
  -ServerUrl string
        ServerUrl (default "http://127.0.0.1:3000")
  -a string
        action: init/start (default "nothing")
  -f string
        configuration file (default "./config.yml")
  -loglevel string
        Log level: debug info warn error fatal panic (default "info")
  -logpath string
        Log path (default "./vaper_agent.log")
```

## Example

```bash
curl -o vaper_agent http://vaper-server:3000/static/agent/vaper_agent
chmod +x ./vaper_agent
nohup ./vaper_agent -a start >>./vaper_agent.log 2>&1 &
```

## Build and run in the development environment

`sh buildRun.sh`  
The buid result is vaper_agent

## Build statically
Be sure you have install the glibc-static.x86_64  
`yum install glibc-static -y`   
`go build -o vaper_agent -ldflags '-linkmode "external" -extldflags "-static"'`





    
<!-- 

## Something More

Vaper-agent need `libpcap` in the development environment. Nobody want to waste time in install libpcap on every host. So we need to make sure that  compiling the vaper_agent statically.

- Find (`#cgo linux LDFLAGS: -lpcap`) in file (pcap.go), and change to something like (`#cgo linux LDFLAGS: -L /tmp/nginx/libpcap-1.8.1 -lpcap`)
- another place glibc

### How to compile libpcap statically
```shell
$ wget http://www.tcpdump.org/beta/libpcap-1.2.0rc1.tar.gz
$ tar xf libpcap-1.2.0rc1.tar.gz && cd libpcap-1.2.0rc1
$ ./configure && make
$ find -name "libpcap.so*" -o -name "libpcap.a"
./libpcap.a
./libpcap.so.1.2.0
``` 

-->