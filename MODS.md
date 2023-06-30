TODO:
- [] Improve tiling support
- [] Add helper for matching on outputs better maybe?
- [] Add script service which includes buttons

Separate command output to allow for simultaneous running without colliding the output.

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

http://localhost:3000/api/commands?group=Desktop&command=StartServer&args=adbaba,secondy


Improve interface:
Add Processing symbol next to commands to know that they are being run. Then some indicator of how it went.
Make buttons more visible. Highlight on hover.
Add popup for arguments. Simple popup form.