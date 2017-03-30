#!/bin/sh

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
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs

#----alsa install
sudo apt-get install -y alsa-base alsa-utils
