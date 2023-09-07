#!/bin/bash
cd "$(dirname "$0")"

REPO="REPO_LOCATION_TEMPLATE"
cd $REPO/config/scripts

echo "Listening for commands sent from commandrunner FIFO..."
while true; do 
    cmd="$(cat ../commandrunner.pipe)"
    echo "Executing '$cmd'"
    eval "$cmd"
done