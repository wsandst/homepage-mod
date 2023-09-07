# Enter Windows on Desktop (warning: will become unresponsive to commands)
# Start computer if not already started
wakeonlan 50:eb:f6:3d:40:fb
# Attempt to switch to windows with a long timeout, to allow for startup
ssh -o ConnectTimeout=15 desktop "sudo /opt/reboot-into-windows-no-gui" 
