#!/bin/bash
runVaper(){
  docker exec -d $1  /bin/sh -c "ps -ef|grep vaper_agent|grep -v grep|awk \"{print \$2}\"|xargs kill"
  docker exec -d $1  /bin/sh -c "rm -rf /tmp/vaper"
  docker exec -d $1  /bin/sh -c "mkdir -p /tmp  && cd /tmp  && curl -o vaper_agent http://vaper-server:3000/static/agent/vaper_agent "
  docker exec -d $1  /bin/sh -c "cd /tmp && chmod +x ./vaper_agent && nohup ./vaper_agent -a start -ServerUrl http://vaper-server:3000 >>./vaper_agent.log 2>&1 &"
  echo "container "$1":reinstall vaper_agent"
}

runVaper 'elasticsearch01'
runVaper 'elasticsearch02'
runVaper 'elasticsearch03'
runVaper 'elasticsearch04'
runVaper 'elasticsearch05'
runVaper 'kibana'
runVaper 'logstash'
runVaper 'metricbeat01'
runVaper 'metricbeat02'
runVaper 'metricbeat03'