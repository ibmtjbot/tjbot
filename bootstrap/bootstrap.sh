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

#----alsa install
sudo apt-get install -y alsa-base alsa-utils

#----install pigpio (npm install pigpio will be exec by tjbotlib package.json)
curl abyz.co.uk/rpi/pigpio/pigpio.zip > pigpio.zip
unzip -o pigpio.zip
cd PIGPIO
make
sudo make install

#----install conversation (to install it will resolve tjbotlib and other dependencies)
cd $TJBOT_FOLDER
cd recipes/conversation

npm install

#----try to run tjbot
if [ ! -f "${TJBOT_FOLDER}/recipes/conversation/config.js" ]; then
    echo "------------------------------------";
    echo "INSTALLATION COMPLETED!!! ;)"
    echo "If you would like to run Conversation, please first create ${TJBOT_FOLDER}/recipes/conversation/config.js with your Bluemix Credentials."
    echo "After that try 'node conversation.js'"
    echo "------------------------------------";
else
    node conversation.js
fi
