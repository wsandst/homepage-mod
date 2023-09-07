#!/bin/bash
cd "$(dirname "$0")"
# Copy over service file
cp COMMANDRUNNER.sh /usr/bin/
cp commandrunner.service /lib/systemd/system/commandrunner.service 
chmod +x /usr/bin/COMMANDRUNNER.sh

sed -i "s|REPO_LOCATION_TEMPLATE|$PWD/..|g" /usr/bin/COMMANDRUNNER.sh

# Setup FIFO
rm ../config/commandrunner.pipe
mkfifo ../config/commandrunner.pipe
chmod 666 ../config/commandrunner.pipe