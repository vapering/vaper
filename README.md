# Vaper

> Take a look at the relations among servers.  

[简体中文](https://vapering.github.io/vaper/#/zh-cn/)  |  [Documentation](https://vapering.github.io/vaper/#/)    

## Screenshot
![2d demo](https://vapering.github.io/vaper/imgs/demo-pc.jpg "2d demo")  
## Quick start
## run vaper-server only

```shell
git clone https://github.com/vapering/vaper.git
cd vaper
docker-compose up -d
```
Open the [http://ip:3000](http://vaper-server:3000)  
run vaper in host or container:
```bash
curl -o vaper_agent https://github.com/vapering/vaper/releases/download/v0.0.1/vaper_agent
chmod +x ./vaper_agent
nohup ./vaper_agent -a start >>./vaper_agent.log 2>&1 &
```

## run vaper-server with a elasticsearch service

```shell
git clone https://github.com/vapering/vaper.git
cd vaper/docker-compose-examples/elasticsearch
docker-compose up -d
```

run vaper-agent in all containers  
`sh run_vaper-agent_in_containers.sh`


Open the [http://ip:3000](http://vaper-server:3000)

