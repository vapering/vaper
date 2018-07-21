#!/bin/bash

runVaper(){
  docker exec -d -u $2 $1  /bin/sh -c "ps -ef|grep vaper_agent|grep -v grep|awk \"{print \$2}\"|xargs kill"
  docker exec -d -u $2 $1  /bin/sh -c "rm -rf /tmp/vaper*"
  docker exec -d -u $2 $1  /bin/sh -c "mkdir -p /tmp/vaper  && cd /tmp/vaper && curl -o vaper_agent http://vaper-server:3000/static/agent/vaper_agent && chmod +x ./vaper_agent && nohup ./vaper_agent -a start -ServerUrl http://vaper-server:3000 >>./vaper_agent.log 2>&1 &"

  echo "container "$1":install vaper_agent"
  sleep 30
}

runVaper 'elasticsearch01' 'root'
runVaper 'logstash' 'logstash'
runVaper 'metricbeat01' 'root'
runVaper 'metricbeat02' 'root'
# runVaper 'kibana'