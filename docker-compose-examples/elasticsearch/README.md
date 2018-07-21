# docker-compose example

> Some scripts to build a elastic stack for vaper testcase.

- docker-composem.yml: 1 elasticsearch + 1 logstash + 1 metricbeat containers.
- run_vaper_agent_in_containers.sh: Run vaper-agent in container above.
- logstash.conf: For logstash container.
- metricbeat.yml: For metricbeat container.

## Run Elasticsearch & logstash & metricbeat
`docker-compose up -f docker-compose.yml -d`

visit  [http://ip:3000](http://ip:3000)

## Run vaper-agent in containers
`sh run_vaper_agent_in_containers.sh `

## Stop
`docker-compose down -f docker-compose.ymld`


