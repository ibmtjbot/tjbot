#!/bin/sh
TJBOT_FOLDER=$(dirname "$PWD")

#----validation
#if $EUID -ne 0; then
#    echo "You need to install as root by using sudo";
#    exit
#fi

#----force ipv4
if ! grep -q "ipv6.disable=1" /boot/cmdline.txt; then
    echo " ipv6.disable=1" | sudo tee -a /boot/cmdline.txt
    echo "We just disabled ipv6 due better network compatibility. It will take effect after restart.";
fi

#----default DNS (google)
if ! grep -q "nameserver 8.8.8.8" /etc/resolv.conf; then
    echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf
    echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf
fi

#----debian missing locale (just to remove warnigs)
export LC_ALL="en_US.UTF-8"
echo "en_US.UTF-8 UTF-8" | sudo tee -a /etc/locale.gen
sudo locale-gen en_US.UTF-8

#----update raspberry
sudo apt-get update
sudo apt-get -y dist-upgrade

#----nodejs install
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

#----install official requirements
sudo apt-get install -y alsa-base alsa-utils libasound2-dev git

#----install missing pigpio in Raspbian Lite (the command npm install pigpio will be exec by package.json)
sudo apt-get install pigpio

#----install git and download tjbot
if [ ! -d "${TJBOT_FOLDER}/recipes/conversation" ]; then
    rm -Rf /home/pi/tjbot
    git clone https://github.com/ibmtjbot/tjbot.git /home/pi/tjbot

    TJBOT_FOLDER='/home/pi/tjbot'
fi

#----install conversation (to install it will resolve tjbotlib and other dependencies)
cd $TJBOT_FOLDER
cd recipes/conversation
echo "path: $PWD"

sudo npm install --unsafe-perm -g node-gyp

#----installation completed
echo "------------------------------------";
echo "INSTALLATION COMPLETED!!! ;)"
echo "------------------------------------";

#----test hardware
cd $TJBOT_FOLDER
cd bootstrap/tests
echo "path: $PWD"

sudo npm install --unsafe-perm -g readline-sync
sudo node test.camera.js
sudo node test.led.js
sudo node test.servo.js
sudo node test.speaker.js

#----try to run tjbot
if [ ! -f "${TJBOT_FOLDER}/recipes/conversation/config.js" ]; then
    echo "------------------------------------";
    echo "If you would like to run Conversation, please first create ${TJBOT_FOLDER}/recipes/conversation/config.js with your Bluemix Credentials."
    echo "After that try 'node conversation.js'"
    echo "------------------------------------";
else
    node conversation.js
fi
