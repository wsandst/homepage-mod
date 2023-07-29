TODO:
- [X] Cleanup code, make the response include bash output
- [X] Add confirmation dialog perhaps?
- [X] Figure out how to package this version to the server. Docker script probs, then include in the other compose
- [ ] BUG: Sometimes the arguments are not included in the API call, why?
        * Issue here is that the form retains state, but we never read this state. Fix this by creating a binding of every form element
        to state, see https://legacy.reactjs.org/docs/forms.html
- [ ] Add the listening script to always be running as a service/cronjob
- [ ] Setup all scripts and commands

## Scripts:
### Desktop:
START, STOP, REBOOT, BOOT WINDOWS

### Server
STOP, REBOOT, UNLOCK MEDIA

STOP_SERVER, REBOOT_SERVER, UNLOCK DRIVE,
RESTART FUNNEL, RESTART DOCKER, MOUNT KINDLE

### KohyaSS
START, STOP (setup service for this)

### Auto1111
START, STOP (setup service for this)

http://localhost:3000/api/commands?group=Desktop&command=StartServer&args=adbaba,secondy

## Other
Idea:
On pressing a running command, open a log window which displays the progress of the command