#!/bin/bash
rm -f ./vaper_agent

echo ''>./vaper_agent.log
buildCMD="go build -o vaper_agent -ldflags '-linkmode \"external\" -extldflags \"-static\"' "
echo -e "\n[BUILD]"
echo -e "comand:$buildCMD"

# Build statically
# Linux 64
go build -o vaper_agent -ldflags '-linkmode "external" -extldflags "-static"'


if [ $? -ne 0 ] ; then
  echo ">>> Error in build work, exit."
  exit 1
else
  echo ">>> Build success."
fi

RUNCMD='sudo ./vaper_agent -a start -f config.yml'
echo -e "\n[RUN]"
echo -e "comand:$RUNCMD"
$RUNCMD
