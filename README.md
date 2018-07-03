# Vaper

> Take a look at the relations among servers.  

[documentation](https://vapering.github.io/vaper/#/)  

### [demo](http://vaper.wengpan.top/)

## Screenshot
![2d demo](/docs/imgs/chart-link-2d-ip.jpg "2d demo")  
## Quick start
## run vaper-server only

```shell
git clone https://github.com/vapering/vaper.git
docker-compose up -d
```
Open the [http://vaper-server:3000](http://vaper-server:3000)  
run vaper in host or container:
```bash
curl -o vaper_agent http://vaper-server:3000/static/agent/vaper_agent
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


Open the [http://vaper-server:3000](http://vaper-server:3000)

