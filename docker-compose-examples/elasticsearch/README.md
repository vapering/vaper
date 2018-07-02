# docker-compose example

> Some scripts to build a elastic stack for vaper testcase.

- docker-composem.yml: 5 elasticsearch + 1 logstash + 3 metricbeat containers.
- run_vaper_container.sh: Run vaper-agent in container above.
- logstash.conf: For logstash container.
- metricbeat.yml: For metricbeat container.

## Run Elasticsearch & logstash & metricbeat
`docker-compose up -f docker-compose.yml -d`

## Run vaper-agent in containers
`sh run_vaper_container.sh `

