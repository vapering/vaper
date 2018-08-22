# Vaper

> 收集服务器之间的网络流量数据，并实时将拓扑关系可视化.  
> 可以应用于系统节点间的调用关系链自动发现，异常应用流量监控, 应用告警收敛等场景。


简体中文  | [English](./README.md)

[中文文档](https://vapering.github.io/vaper/#/zh-cn/)  
[Documentation](https://vapering.github.io/vaper/#/)    

[演示](http://vaper.wengpan.top) 

## 截图
![2d demo](https://vapering.github.io/vaper/imgs/demo-pc.zh-cn.jpg "2d demo")  
## 快速开始
## 只部署 vaper-server 和 neo4j数据库
```shell
git clone https://github.com/vapering/vaper.git
cd vaper
docker-compose up -d
```
浏览器打开[http://ip:3000](http://vaper-server:3000)  
在操作系统或者容器内运行vaper_agent
```bash
curl -o vaper_agent https://github.com/vapering/vaper/releases/download/v0.0.1/vaper_agent
chmod +x ./vaper_agent
nohup ./vaper_agent -a start -ServerUrl http://ip:3000 >>./vaper_agent.log 2>&1 &
```

## 部署一个vaper-server和elasticsearch服务  
```shell
git clone https://github.com/vapering/vaper.git
cd vaper/docker-compose-examples/elasticsearch
docker-compose up -d
```
在容器内运行 vaper-agent   
`sh run_vaper-agent_in_containers.sh`

Open the [http://ip:3000](http://vaper-server:3000)  

## 计划
- 提供其他工具采集数据，比如shell脚本，或者其他自动化工具。 
- 对agent在高网络负载的情况下的性能做测试。 
- 单元测试

## 问题反馈
如果有问题和疑问都可以发布在GitHub issue。

## 参与    
欢迎小伙伴提交的新功能、修复、或者更新；
