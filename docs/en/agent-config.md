# vaper_agent configuration

`config.yml`


```yaml
# vaper_agent configuration file

uuid:
    # path
    # default: "./vaper_agent.uid"
    # The uuid（Universally Unique Identifier） of this host
    # agent will generate a new uuid when run: vaper_agent -a init.
    path: "./vaper_agent.uidd"

    # autogenerate
    # 0 : Only try to read the uuid.txt.
    # 1 : Generate the uid auto.
    # Auto means agent will generate a uid file When there is no uuid.uid.
    # default:"1"
    autogenerate: "1"

log:
    # level
    # default: info 
    # Optional: debug info warn error fatal panic
    level: "info"

    # path
    # default: "./vaper_agent.log" 
    path: "./vaper_agent.log"

frequency:
    # HostInfoFrequency
    # default: "60"
    # Frequency of host info send in seconds.
    # 120 - 3600
    hostInfo: "60"

    # NetworkFlowFrequency
    # default: "10"
    # Frequency of network flow info send in seconds.
    # 30 - 3600
    networkflow: "10"

# PackagesLimit
# Default:"10"
# How many packages you want to catch during the "networkFlowFrequency" seconds.
# Attention: Do not set this param to a big number.More packet been catched, the vaper_agent cost more system.
# 1-600
packageslimit: "10"

# server
# default:"http://127.0.0.1:3000"
# the Vaper-server-backend address
server: "http://127.0.0.1:3000"

```