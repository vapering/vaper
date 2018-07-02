# Vaper-agent

Agent is a golang project. Collect netflow data and hostmeta info from operating system.
[https://github.com/vapering/vaper-agent](https://github.com/vapering/vaper-agent)

## Deploy in production environment

Vaper-agent need two files to run:

- vaper_agent

### Run

`./vaper_agent -a start`

### Run in daemon

`nohup ./vaper_agent -a start >>./vaper_agent.log 2>&1 &`

### Example

```bash
curl -o vaper_agent http://vaper-server:3000/static/agent/vaper_agent
chmod +x ./vaper_agent
nohup ./vaper_agent -a start >>./vaper_agent.log 2>&1 &
```

## Build and run in the development environment

`sh buildRun.sh`  
The buid result is vaper_agent

## build statically
Be sure you have install the glibc-static.x86_64  
`yum install glibc-static -y`   
`go build -o vaper_agent -ldflags '-linkmode "external" -extldflags "-static"'`

