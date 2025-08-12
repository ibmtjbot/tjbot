#!/bin/bash

#----make sure this is run as root
user=$(id -u)
if [ "$user" -ne 0 ]; then
    echo "This script requires root permissions. Please run this script with sudo."
    exit
fi

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
echo "a clean install of Raspbian. If you are running this script on a"
echo "Raspberry Pi that you've used for other projects, please take a look at"
echo "what this script does BEFORE running it to ensure you are comfortable"
echo "with its actions (e.g. performing an OS update, installing software"
echo "packages, removing old packages, etc.)"
echo "-----------------------------------------------------------------------"

#----confirm bootstrap
read -r -p "Would you like to use this Raspberry Pi for TJBot? [Y/n] " choice </dev/tty
case "$choice" in
    "n" | "N")
        echo "OK, TJBot software will not be installed at this time."
        exit
        ;;
    *) ;;
esac
echo

#----don't install on an armv6l, it's not supported
CPUARCH=$(lscpu | grep Arch | cut -d':' -f2 | awk '{$1=$1};1')
if [ "$CPUARCH" = 'armv6l' ];
   then
      echo "ARMv6 is not supported for TJBot due to software availability on this processor architecture. Please use another Raspberry Pi model."
      exit 1
else
   echo "$CPUARCH processor architecture supported. Proceeding with setup."
fi

#----raspian versions older than jessie (8) won't work
RASPBIAN_VERSION_ID=$(cat /etc/os-release | grep VERSION_ID | cut -d '"' -f 2)
if [ "$RASPBIAN_VERSION_ID" -lt 8 ]; then
    echo "Warning: it looks like your Raspberry Pi is running an older version"
    echo "of Raspian. TJBot has only been tested on Raspian 8 (Jessie) and"
    echo "later."
    echo ""
    read -r -p "Would you like to continue with setup? [Y/n] " choice </dev/tty
    case "$choice" in
        "n" | "N")
            echo "OK, TJBot software will not be installed at this time."
            exit
            ;;
        *) ;;
    esac
fi

#----set TJBot hostname
CURRENT_HOSTNAME=$(cat /etc/hostname | tr -d " \t\n\r")
echo ""
echo "Please enter a name for your TJBot. This will be used for the hostname of"
echo "your Raspberry Pi."
read -r -p "TJBot hostname (currently $CURRENT_HOSTNAME): " name </dev/tty
name=$(echo "$name" | tr -d ' ')
if [ -z "$name" ]; then
    name=$CURRENT_HOSTNAME
fi
echo "Setting DNS hostname to $name"
echo "$name" | tee /etc/hostname >/dev/null 2>&1
sed -i "s/127.0.1.1.*$CURRENT_HOSTNAME/127.0.1.1\t$name/g" /etc/hosts

#----disable ipv6
echo ""
echo "In some networking environments, disabling ipv6 may help your Raspberry Pi connect to"
echo "your network."
read -r -p "Disable ipv6? [y/N] " choice </dev/tty
case "$choice" in
    "y" | "Y")
        echo "Disabling ipv6"
        echo " ipv6.disable=1" | tee -a /boot/cmdline.txt
        echo "ipv6 has been disabled. It will take effect after rebooting."
        ;;
    *) ;;
esac

#----set DNS to Quad9
echo ""
echo "In some networking environments, using Quad9's nameservers may speed up"
echo "DNS queries and provide extra security and privacy."
read -r -p "Enable Quad9 DNS? [y/N]: " choice </dev/tty
case "$choice" in
    "y" | "Y")
        echo "Adding Quad9 DNS servers to /etc/resolv.conf"
        if ! grep -q "nameserver 9.9.9.9" /etc/resolv.conf; then
            echo "nameserver 9.9.9.9" | tee -a /etc/resolv.conf
            echo "nameserver 149.112.112.112" | tee -a /etc/resolv.conf
        fi
        ;;
    *) ;;
esac

#----set locale to US
echo ""
read -r -p "Set locale to US English (en-US)? [y/N] " choice </dev/tty
case "$choice" in
    "y" | "Y")
        echo "Updating locale to en-US. Please ignore any errors below."
        export LC_ALL="en_US.UTF-8"
        echo "en_US.UTF-8 UTF-8" | tee -a /etc/locale.gen
        locale-gen en_US.UTF-8
        ;;
    *) ;;
esac

#----update raspberry software
echo ""
echo "TJBot requires an up-to-date installation of your Raspberry Pi's operating"
echo "system software. If you have never done this before, it can take up to an"
echo "hour or longer."
read -r -p "Proceed with apt-get dist-upgrade? [Y/n] " choice </dev/tty
case "$choice" in
    "n" | "N")
        echo "Warning: you may encounter problems running TJBot recipes without performing"
        echo "an apt-get dist-upgrade. If you experience these problems, please re-run"
        echo "the bootstrap script and perform this step."
        ;;
    *)
        echo "Updating apt repositories [apt-get update]"
        apt-get update
        echo "Upgrading OS distribution [apt-get dist-upgrade]"
        apt-get -y dist-upgrade
        ;;
esac

#----install nodejs
echo ""

MIN_NODE_LEVEL="22"

if which node > /dev/null; then
    NODE_VERSION=$(node --version 2>&1)
    NODE_LEVEL=$(node --version 2>&1 | cut -d '.' -f 1 | cut -d 'v' -f 2)
    if [ "$NODE_LEVEL" -lt $MIN_NODE_LEVEL ]; then
        echo "Warning: Node.js v$NODE_VERSION.x is currently installed, but TJBot requires"
        echo "Node.js v$MIN_NODE_LEVEL.x or later. Please update your Node.js version."
    fi
else
    echo "Node.js is not installed. It is required for TJBot to funciton."
    read -r -p "Would you like to install Node.js via nvm or mise? [default: nvm]: " choice </dev/tty
    case "$choice" in
        "" | "nvm")
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
            nvm install node
            ;;
        "mise")
            curl https://mise.run | sh
            mise use --global node@latest
            ;;
        *)
            echo "Warning: TJBot may not operate without installing a current version of Node.js."
            ;;
    esac
fi

#----install additional packages
echo ""
echo "Installing additional software packages [apt-get install libasound2-dev libportaudio0 libportaudio2 libportaudiocpp0 porta
udio19-dev]"
apt-get install -y libasound2-dev libportaudio0 libportaudio2 libportaudiocpp0 portaudio19-dev

#----remove outdated apt packages
echo ""
echo "Removing unused software packages [apt-get autoremove]"
apt-get -y autoremove

#----enable camera on raspbery pi
echo ""
echo "If your Raspberry Pi has a camera installed, TJBot can use it to see."
read -r -p "Enable camera? [y/N] " choice </dev/tty
case "$choice" in
    "y" | "Y")
        if grep "start_x=1" /boot/config.txt
        then
            echo "Camera is already enabled."
        else
            echo "Enabling camera."
            if grep "start_x=0" /boot/config.txt
            then
                sed -i "s/start_x=0/start_x=1/g" /boot/config.txt
            else
                echo "start_x=1" | tee -a /boot/config.txt >/dev/null 2>&1
            fi
            if grep "gpu_mem=128" /boot/config.txt
            then
                :
            else
                echo "gpu_mem=128" | tee -a /boot/config.txt >/dev/null 2>&1
            fi
        fi
        ;;
    *) ;;
esac

#----clone tjbot
echo ""
echo "We are ready to clone the TJBot project."
read -r -p "Where should we clone it to? (default: /home/pi/Desktop/tjbot): " TJBOT_DIR </dev/tty
if [ -z "$TJBOT_DIR" ]; then
    TJBOT_DIR='/home/pi/Desktop/tjbot'
fi

if [ ! -d "$TJBOT_DIR" ]; then
    echo "Cloning TJBot project to $TJBOT_DIR"
    sudo -u "$SUDO_USER" git clone https://github.com/ibmtjbot/tjbot.git "$TJBOT_DIR"
else
    echo "TJBot project already exists in $TJBOT_DIR, leaving it alone"
fi

#----blacklist audio kernel modules
echo ""
echo "On Raspberry Pi 3 models, there is a known conflict between the LED "
echo "and the built-in audio jack. In order for the LED to work, we need to"
echo "disable certain kernel modules to avoid this conflict. If you have "
echo "plugged in a speaker via HDMI, USB, or Bluetooth, this is a safe "
echo "operation and you will be able to play sound and use the LED at the "
echo "same time. If you plan to use the built-in audio jack, we recommend "
echo "NOT disabling the sound kernel modules."
read -r -p "Disable sound kernel modules? [Y/n] " choice </dev/tty
case "$choice" in
    "" | "y" | "Y")
        echo "Disabling the kernel modules for the built-in audio jack."
        cp "$TJBOT_DIR"/bootstrap/tjbot-blacklist-snd.conf /etc/modprobe.d/
        ;;
    "n" | "N")
        if [ -f /etc/modprobe.d/tjbot-blacklist-snd.conf ]; then
            echo "Enabling the kernel modules for the built-in audio jack."
            rm /etc/modprobe.d/tjbot-blacklist-snd.conf
        fi
        ;;
    *) ;;
esac

#----installation complete
sleep_time=0.1
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
read -r -p "Press enter to continue" </dev/tty

#——instructions for ibm cloud credentials
echo ""
echo "Notice about IBM Cloud services: Before running any recipes, you will"
echo "need to obtain credentials for the IBM Cloud services used by those"
echo "recipes. Check each recipe's README.md file for further instructions."
read -r -p "Press enter to continue" </dev/tty

#----reboot
echo ""
read -r -p "We recommend rebooting for all changes to take effect. Reboot? [Y/n] " choice </dev/tty
case "$choice" in
    "" | "y" | "Y")
        echo "Rebooting."
        reboot
        ;;
    *)
        echo "Please reboot your Raspberry Pi for all changes to take effect."
        ;;
esac
