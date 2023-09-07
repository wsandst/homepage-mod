#!/bin/bash
cd "$(dirname "$0")"

# Template is replaced by the INSTALL.sh script
HOMEPAGE_CONFIG_DIR="HOMEPAGE_CONFIG_DIR_TEMPLATE"
cd $HOMEPAGE_CONFIG_DIR/scripts

echo "Listening for commands sent from commandrunner FIFO..."
while true; do 
    cmd="$(cat ../commandrunner.pipe)"
    echo "Executing '$cmd'"
    eval "$cmd"
done