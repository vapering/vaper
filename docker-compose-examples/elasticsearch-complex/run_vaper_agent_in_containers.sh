#!/bin/bash

runVaper(){
  docker exec -d -u $2 $1  /bin/sh -c "ps -ef|grep vaper_agent|grep -v grep|awk \"{print \$2}\"|xargs kill"
  docker exec -d $1  /bin/sh -c "rm -rf /tmp/vaper && mkdir -p /tmp/vaper"

  docker cp ../../agent/vaper_agent $1:/tmp/vaper/vaper_agent
  docker exec -d $1  /bin/sh -c "chown $2.$2 /tmp/vaper/ && chmod +x /tmp/vaper/vaper_agent"
  

  docker exec -d -u $2 $1  /bin/sh -c "cd /tmp/vaper && nohup ./vaper_agent -a start -ServerUrl http://vaper-server:3000 >>./vaper_agent.log 2>&1 &"
  echo "container "$1":install vaper_agent"
  sleep 1
}

runVaper 'elasticsearch01' 'elasticsearch'
runVaper 'elasticsearch02' 'elasticsearch'
runVaper 'elasticsearch03' 'elasticsearch'
runVaper 'logstash' 'logstash'
runVaper 'metricbeat01' 'root'
runVaper 'metricbeat02' 'root'
runVaper 'kibana' 'root'
runVaper 'nginx' 'root'

# runVaper 'vaper-server' 'root'
# runVaper 'neo4j' 'root'
