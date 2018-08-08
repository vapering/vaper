# docker-compose example


## Example 1：run vaper only
run 2 containters, 2 cores require.
```shell
git clone https://github.com/vapering/vaper.git
docker-compose up -d
```

## Example 2：run vaper with a elasticsearch service
run 7 containters, 4 cores require.
```shell
git clone https://github.com/vapering/vaper.git   
cd vaper/docker-compose-examples/elasticsearch  
docker-compose up -d
```
run vaper in all containers  
`sh run_vaper-agent_in_containers.sh`  
Open the [http://localhost:3000](http://localhost:3000)  
Screenshot:
![2d demo](../imgs/demo-pc-simple.jpg)  

## Example 3：run vaper with a elasticsearch service
run 10 containters, 8 cores require.

```shell
git clone https://github.com/vapering/vaper.git
cd vaper/docker-compose-examples/elasticsearch-complex
docker-compose up -d
```
run vaper in all containers  
`sh run_vaper-agent_in_containers.sh`  
Open the [http://localhost:3000](http://localhost:3000)  
Screenshot:
![2d demo](../imgs/demo-pc.jpg)

