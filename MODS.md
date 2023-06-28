TODO:
- [] Improve tiling support
- [] Add script running
    - [] Improve API endpoint reliability
    - [] Refactor code and cleanup new implementation
    - [] Create FIFO if it does not already exist
- [] Add script service which includes buttons

Figure out how to display the results of certain commands, like ON/OFF command checks based on return values. 
Tricky, maybe keep a file with the information? output.txt

https://stackoverflow.com/questions/32163955/how-to-run-shell-script-on-host-from-docker-container

## Scripts:
### Computers:
START_DESKTOP, STOP_DESKTOP, REBOOT_DESKTOP
STOP_SERVER, REBOOT_SERVER

## Media
UNLOCK_DRIVE.sh

### Tailscale:
Restart tailscale, stop funnel, enable funnel

### AI
START_KOHYA, STOP_KOHYA (service)
START_AUTO1111, STOP_AUTO1111


Messages are sometimes lost when being sent through the named pipe, any way to fix this?
See script-helpers.js, scripts.js