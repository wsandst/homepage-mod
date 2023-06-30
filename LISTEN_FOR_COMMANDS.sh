cd "$(dirname "$0")"

SCRIPT_RUNNER_FILE=config/commandrunner
if [ ! -e "$SCRIPT_RUNNER_FILE" ]; then
    echo "Commandrunner FIFO does not exist, creating it"
    mkfifo $SCRIPT_RUNNER_FILE
    chmod o+w config/commandrunner
fi

cd config/scripts

echo "Listening for commands sent from commandrunner FIFO..."
while true; do eval "$(cat ../commandrunner)"; done