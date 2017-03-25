#!/bin/sh

#update
sudo apt-get update
sudo apt-get -y dist-upgrade

#nodejs
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs

#alsa
sudo apt-get install -y alsa-base alsa-utils
