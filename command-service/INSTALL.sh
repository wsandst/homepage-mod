#!/bin/bash
cd "$(dirname "$0")"

if [ "$#" -le 0 ]; then
    echo "Error: Please specify a homepage config directory"
    echo "Usage: ./INSTALL <HOMEPAGE_CONFIG>"
    exit
fi

CONFIG_PATH="$(realpath $1)"
echo "Received config path: $CONFIG_PATH"
echo "Installing into /usr/bin"

# Copy over service file
cp COMMANDRUNNER.sh /usr/bin/
cp commandrunner.service /lib/systemd/system/commandrunner.service 
chmod +x /usr/bin/COMMANDRUNNER.sh

sed -i "s|HOMEPAGE_CONFIG_DIR_TEMPLATE|$CONFIG_PATH|g" /usr/bin/COMMANDRUNNER.sh

# Setup FIFO
rm ../config/commandrunner.pipe
mkfifo ../config/commandrunner.pipe
chmod 666 ../config/commandrunner.pipe