# docker-compose 例子

## 部署案例1：只部署 vaper-server
启动2个容器，建议2核以上

```shell
git clone https://github.com/vapering/vaper.git
cd vaper
docker-compose up -d
```
打开 [http://ip:3000](http://vaper-server:3000)  

在操作系统或者容器内运行 vaper-agent 收集数据
```bash
curl -o vaper_agent https://github.com/vapering/vaper/releases/download/v0.0.1/vaper_agent
chmod +x ./vaper_agent
nohup ./vaper_agent -a start >>./vaper_agent.log 2>&1 &
```

## 部署案例2：部署一个 vaper-server 和 elasticsearch实例服务
启动7个容器，建议4核以上
```shell
git clone https://github.com/vapering/vaper.git
cd vaper/docker-compose-examples/elasticsearch
docker-compose up -d
```

在所有的容器里面运行 vaper-agent 收集数据  
`sh run_vaper-agent_in_containers.sh`  
打开浏览器访问 [http://ip:3000](http://vaper-server:3000)  
截图：
![2d demo](../imgs/demo-pc-simple.jpg)

## 部署案例3：部署一个 vaper-server 和 elasticsearch实例服务
会启动共10个容器，建议8C以上

```shell
git clone https://github.com/vapering/vaper.git
cd vaper/docker-compose-examples/elasticsearch-complex
docker-compose up -d
```

在所有的容器里面运行 vaper-agent 收集数据  
`sh run_vaper-agent_in_containers.sh`  
打开浏览器访问 [http://ip:3000](http://vaper-server:3000)
截图：
![2d demo](../imgs/demo-pc.jpg)

