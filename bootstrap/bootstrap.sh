#!/bin/bash

#----intro message
echo "---------------------------------------------"
echo "Welcome! Let's set up your TJBot"
echo "---------------------------------------------"

#----setting TJBot name
echo "Let's name of your TJBot!"
read -p "Please type in your TJBot's name followed by [ENTER]: " name
while [ -z "${name// }" ]
do
echo "Error. Name cannot be empty string"
read -p "Please type in your TJBot's name followed by [ENTER]: " name
done
echo "Setting TJBot name and DNS name to $name"
echo "$name" | sudo tee /etc/hostname >/dev/null 2>&1

#----disabling ipv6
read -p "[Optional] Would you liked to disable ipv6? (Y/N: default): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
     echo "Disabling ipv6"
     echo " ipv6.disable=1" | sudo tee -a /boot/cmdline.txt
     echo "We just disabled ipv6 due better network compatibility. It will take effect after restart.";;
*) ;;
esac

#----setting DNS to Google
read -p "[Optional] Would you liked to set DNS to Google Server? (Y/N: default): " choice
shopt -s nocasematch
case "$choice" in
 "y" ) 
     echo "Setting Google DNS Server"
     if ! grep -q "nameserver 8.8.8.8" /etc/resolv.conf; then
    	echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf
        echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf
     fi ;;
*) ;;
esac

#----setting local to US
read -p "[Optional] Would you liked to set locale to en-US? (Y/N: default): " choice
shopt -s nocasematch
case "$choice" in
 "y" ) 
     echo "Setting Locale to en-US"
     export LC_ALL="en_US.UTF-8"
     echo "en_US.UTF-8 UTF-8" | sudo tee -a /etc/locale.gen
     sudo locale-gen en_US.UTF-8
     ;;
*) ;;
esac

#----update raspberry
echo "Updating Raspberry Pi"
sudo apt-get update
sudo apt-get -y dist-upgrade

#----nodejs install
node_version=$(node --version 2>&1)
echo "Checking installed Node version. You have Node version $node_version installed. TJBot requires Node 6 or higher."
read -p "Would you liked to install Node 6? (Y/N: default): " choice
shopt -s nocasematch
case "$choice" in
 "y" ) 
	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	sudo apt-get install -y nodejs
     ;;
*) ;;
esac

#----install official requirements
echo "Installing official requirements (alsa, libasound2, git)"
sudo apt-get install -y alsa-base alsa-utils libasound2-dev git

#----install missing pigpio in Raspbian Lite (the command npm install pigpio will be exec by package.json)
echo "Installing missing pigpio in Raspbian Lite"
sudo apt-get install pigpio

#----enabling camera on raspbery pi
echo "Checking to enable camera"
grep "start_x=1" /boot/config.txt
if grep "start_x=1" /boot/config.txt
then
	echo "Camera is alredy enabled."
else
	echo "Enabling camera."
        sudo sed -i "s/start_x=0/start_x=1/g" /boot/config.txt
	echo "gpu_mem=128" | sudo tee -a /boot/config.txt >/dev/null 2>&1
fi
exit

#----setting audio option 
read -p "[Optional] If you have plugged in your speaker via USB or Bluetooth, we need to disable the kernel modules for the built-in audio jack. Do you want to disable the kernel modules for the built-in audio jack? (Y/N: default): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
	echo "Disabling the kernel modules for the built-in audio jack."
	sudo cp tjbot-blacklist-snd.conf /etc/modprobe.d/ 
     ;;
*) ;;
esac

#----install git and download tjbot
echo "Downloading TJBot to Desktop/TJBot folder"
TJBOT_FOLDER='/home/pi/Desktop/tjbot'

if [ ! -d "${TJBOT_FOLDER}/recipes/conversation" ]; then
    sudo rm -Rf /home/pi/Desktop/tjbot
    git clone https://github.com/ibmtjbot/tjbot.git /home/pi/Desktop/tjbot

    TJBOT_FOLDER='/home/pi/Desktop/tjbot'
fi

#----install conversation (to install it will resolve tjbotlib and other dependencies)
echo "Installing conversation recipe"
cd $TJBOT_FOLDER
cd recipes/conversation
echo "path: $PWD"

echo "Performing npm install. Please wait until npm install completes. It may take few minutes."

npm install > install.log 2>&1

#----installation completed
echo "------------------------------------";
echo "INSTALLATION COMPLETED!!! ;)"
echo "------------------------------------";

#----reboot 
read -p "We have made lots of changes. We highly recommend rebooting TJBot to ensure everything will work. Do you want to reboot now? (Y/N: default): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
	echo "Rebooting TJBot."
	sudo reboot 
     ;;
*)
 	echo "Please reboot TJBot before you use it."
     ;;
esac


