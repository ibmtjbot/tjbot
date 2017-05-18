#!/bin/bash

#----ascii art!
echo " _   _ _           _     _                 _       _                   "
echo "| | (_) |         | |   | |               | |     | |                  "
echo "| |_ _| |__   ___ | |_  | |__   ___   ___ | |_ ___| |_ _ __ __ _ _ __  "
echo "| __| | '_ \ / _ \| __| | '_ \ / _ \ / _ \| __/ __| __| '__/ _\` | '_ \ "
echo "| |_| | |_) | (_) | |_  | |_) | (_) | (_) | |_\__ \ |_| | | (_| | |_) |"
echo " \__| |_.__/ \___/ \__| |_.__/ \___/ \___/ \__|___/\__|_|  \__,_| .__/ "
echo "   _/ |                                                         | |    "
echo "  |__/                                                          |_|    "

#----intro message
echo ""
echo "-----------------------------------------------------------------------"
echo "Welcome! Let's set up your Raspberry Pi with the TJBot software."
echo ""
echo "Important: This script was designed for setting up a Raspberry Pi after"
echo "a clean install of Raspbian (Jessie). If you are running this on a"
echo "Raspberry Pi that you've used for other projects, please take a look at"
echo "what this script does BEFORE running it to ensure you are comfortable"
echo "with its actions (e.g. performing an OS update, installing software"
echo "packages, removing old packages, etc.)"
echo "-----------------------------------------------------------------------"

#----confirm bootstrap
read -p "Would you like to use this Raspberry Pi for TJBot? Y/n: " choice
shopt -s nocasematch
case "$choice" in
 "n" )
    echo "OK, TJBot software will not be installed at this time."
    exit
    ;;
 *) ;;
esac

#----setting TJBot name
CURRENT_HOSTNAME=`cat /etc/hostname | tr -d " \t\n\r"`
echo ""
echo "Please enter a name for your TJBot. This will be used for the hostname of"
echo "your Raspberry Pi."
read -p "TJBot name (current: $CURRENT_HOSTNAME): " name
shopt -s nocasematch
if [ -z "${name// }" ]; then
    name=$CURRENT_HOSTNAME
fi
echo "Setting DNS hostname to $name"
echo "$name" | sudo tee /etc/hostname >/dev/null 2>&1
sudo sed -i "s/127.0.1.1.*$CURRENT_HOSTNAME/127.0.1.1\t$name/g" /etc/hosts

#----disabling ipv6
echo ""
echo "In some networking environments, disabling ipv6 may help your Pi get on"
echo "the network."
read -p "Disable ipv6? (y/N): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
    echo "Disabling ipv6"
    echo " ipv6.disable=1" | sudo tee -a /boot/cmdline.txt
    echo "ipv6 has been disabled. It will take effect after rebooting.";;
 *) ;;
esac

#----setting DNS to Google
echo ""
echo "In some networking environments, using Google's nameservers may speed up"
echo "DNS queries."
read -p "Enable Google DNS? (y/N): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
    echo "Adding Google DNS servers to /etc/resolv.conf"
    if [ ! grep -q "nameserver 8.8.8.8" /etc/resolv.conf ]; then
        echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf
        echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf
    fi ;;
 *) ;;
esac

#----setting local to US
echo ""
read -p "Force locale to US English (en-US)? (y/N): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
    echo "Forcing locale to en-US. Please ignore any errors below."
    export LC_ALL="en_US.UTF-8"
    echo "en_US.UTF-8 UTF-8" | sudo tee -a /etc/locale.gen
    sudo locale-gen en_US.UTF-8
    ;;
 *) ;;
esac

#----update raspberry
echo ""
echo "TJBot requires an up-to-date installation of your Raspberry Pi's operating"
echo "system software."
read -p "Proceed with apt-get dist-upgrade? (Y/n): " choice
shopt -s nocasematch
case "$choice" in
 "n" )
    echo "Warning: you may encounter problems running TJBot recipes without performing"
    echo "an apt-get dist-upgrade. If you experience these problems, please re-run"
    echo "the bootstrap script and perform this step."
    ;;
 *)
    echo "Updating apt repositories [apt-get update]"
    sudo apt-get update
    echo "Upgrading OS distribution [apt-get dist-upgrade]"
    sudo apt-get -y dist-upgrade
    ;;
esac

#----nodejs install
node_version=$(node --version 2>&1)
echo ""
echo "TJBot requires Node.js version 6. We detected Node.js version $node_version"
echo "is already installed."
read -p "Install Node 6.x? (Y/n): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ;;
 *)
    echo "Warning: TJBot will encounter problems with versions of Node.js older than 6.x."
    echo "TJBot has not been tested with Node.js version 7 or higher."
    ;;
esac

#----install additional packages
echo ""
echo "Installing additional software packages (alsa, libasound2, git, pigpio)"
sudo apt-get install -y alsa-base alsa-utils libasound2-dev git pigpio

#----remove outdated apt packages
echo ""
echo "Removing unused software packages [apt-get autoremove]"
sudo apt-get -y autoremove

#----enable camera on raspbery pi
echo ""
echo "If your Raspberry Pi has a camera installed, TJBot can use it to see."
read -p "Enable camera? (y/N): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
    if grep "start_x=1" /boot/config.txt
    then
        echo "Camera is alredy enabled."
    else
        echo "Enabling camera."
        if grep "start_x=0" /boot/config.txt
        then
            sudo sed -i "s/start_x=0/start_x=1/g" /boot/config.txt
        else
            echo "start_x=1" | sudo tee -a /boot/config.txt >/dev/null 2>&1
        fi
        if grep "gpu_mem=128" /boot/config.txt
        then
            :
        else
            echo "gpu_mem=128" | sudo tee -a /boot/config.txt >/dev/null 2>&1
        fi
    fi
    ;;
 *) ;;
esac

#----clone tjbot
echo ""
echo "We are ready to clone the TJBot project."
read -p "Where should we clone it to? (default: /home/pi/Desktop/tjbot): " TJBOT_DIR
if [ -z "${TJBOT_DIR// }" ]; then
    TJBOT_DIR='/home/pi/Desktop/tjbot'
fi

if [ ! -d $TJBOT_DIR ]; then
    echo "Cloning TJBot project to $TJBOT_DIR"
    git clone https://github.com/ibmtjbot/tjbot.git $TJBOT_DIR
else
    echo "TJBot project already exists in $TJBOT_DIR, leaving it alone"
fi

#----blacklist audio kernel modules
echo ""
echo "In order for the LED to work, we need to disable certain kernel modules to"
echo "avoid a conflict with the built-in audio jack. If you have plugged in a"
echo "speaker via HDMI, USB, or Bluetooth, this is a safe operation and you will"
echo "be able to play sound and use the LED at the same time. If you plan to use"
echo "the built-in audio jack, we recommend NOT disabling the sound kernel"
echo "modules."
read -p "Disable sound kernel modules? (Y/n): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
    echo "Disabling the kernel modules for the built-in audio jack."
    sudo cp $TJBOT_DIR/bootstrap/tjbot-blacklist-snd.conf /etc/modprobe.d/ 
    ;;
 "n" )
    echo "Enabling the kernel modules for the built-in audio jack."
    sudo rm /etc/modprobe.d/tjbot-blacklist-snd.conf
    ;;
 *) ;;
esac

#----installation complete
sleep_time=0.2
echo ""
echo ""
echo "                           .yNNs\`                           "
sleep $sleep_time
echo "                           :hhhh-                           "
sleep $sleep_time
echo "/ssssssssssssssssssssssssssssssssssssssssssssssssssssssssss+"
sleep $sleep_time
echo "yNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMNmmmNMMMMMMMMMMMMMMMMMMMMMMNmmmMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMNd/\`\`\`.+NNMMMMMMMMMMMMMMMMNm+.\` \`/dNMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMNo     \`hMMMMMMMMMMMMMMMMMMy\`     oNMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMNm+.\`\`-sNMMMMMMMMMMMMMMMMMNNs-\`\`.+mNMMMMMMMMMMMy"
sleep $sleep_time
echo "yMMMMMMMMMMMMMMNmmMMMMMMMMMMMMMMMMMMMMMMMMmmNMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "yNNNNNMMMMMMMMMMMMNNNNNNMMNNNNNNNNNNMMMMMMMMMMMMMMMMMMMNNNMy"
sleep $sleep_time
echo "-::::::::::::::::::::::::::::::::::::::::::::::::::::::::::-"
sleep $sleep_time
echo "                                                            "
sleep $sleep_time
echo "                     \`\`\`\`\`\`\`\`....--::::////++++ooossyyhhhhh/"
sleep $sleep_time
echo "//++ossssssyyyyhhddmmmmmmmmmmmmNNNNNMMNNNNNNMMMMMMMMMMMMMNNo"
sleep $sleep_time
echo "dMNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy"
sleep $sleep_time
echo "sMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd"
sleep $sleep_time
echo "oNMMMMMMMMMMMMMMMMNNNNNNNNMMMMMMNNNNNmmmmmmmmmddhhhhyyyyssss"
sleep $sleep_time
echo "+Nmmmddhhhhyyyyssoo++++/////:::---....\`\`\`\`\`\`\`\`        "
sleep $sleep_time
echo ""
sleep $sleep_time
echo "-------------------------------------------------------------------"
sleep $sleep_time
echo "Setup complete. Your Raspberry Pi is now set up as a TJBot! ;)"
sleep $sleep_time
echo "-------------------------------------------------------------------"
echo ""
read -p "Press enter to continue: " dummy

#——instructions for watson credentials
echo "Notice about Watson services: Before running any recipes, you will need"
echo "to obtain credentials for the Watson services used by those recipes."
echo "You can obtain these credentials as follows:"
echo ""
echo "1. Sign up for a free IBM Bluemix account at https://bluemix.net if you do
not have one already."
echo "2. Log in to Bluemix and create an instance of the Watson services you plan
to use. The Watson services are listed on the Bluemix dashboard, under
\"Catalog\". The full list of Watson services used by TJBot are:"
echo "Conversation, Language Translator, Speech to Text, Text to Speech,"
echo "Tone Analyzer, and Visual Recognition"
echo "3. For each Watson service, click the \"Create\" button on the bottom right
of the page to create an instance of the service."
echo "4. Click \"Service Credentials\" in the left-hand sidebar. Next, click
\"View Credentials\" under the Actions menu."
echo "5. Make note of the credentials for each Watson service. You will need to save
these in the config.js files for each recipe you wish to run."
echo "For more detailed guides on setting up service credentials, please see the
README file of each recipe, or search instructables.com for \"tjbot\"."
echo ""
read -p "Press enter to continue: " dummy

#----tests
echo ""
echo "TJBot includes a set of hardware tests to ensure all of the hardware is"
echo "functioning properly. If you have made any changes to the camera or"
echo "sound configuration, we recommend rebooting first before running these"
echo "tests as they may fail. You can run these tests at anytime by running"
echo "the runTests.sh script in the tjbot/bootstrap folder."
read -p "Would you like to run hardware tests at this time? (y/N): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
    ./runTests.sh $TJBOT_DIR
    ;;
 *) ;;
esac

#----reboot
echo ""
read -p "We recommend rebooting for all changes to take effect. Reboot? (Y/n): " choice
shopt -s nocasematch
case "$choice" in
 "y" )
    echo "Rebooting."
    sudo reboot
    ;;
 *)
     echo "Please reboot your Raspberry Pi for all changes to take effect."
    ;;
esac
