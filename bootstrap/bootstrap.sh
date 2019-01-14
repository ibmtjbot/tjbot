#!/bin/sh

#----make sure this is run as root
user=`id -u`
if [ $user -ne 0 ]; then
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
read -p "Would you like to use this Raspberry Pi for TJBot? [Y/n] " choice </dev/tty
case "$choice" in
    "n" | "N")
        echo "OK, TJBot software will not be installed at this time."
        exit
        ;;
    *) ;;
esac

#----test raspbian version: 8 is jessie, 9 is stretch
RASPIAN_VERSION_ID=`cat /etc/os-release | grep VERSION_ID | cut -d '"' -f 2`
RASPIAN_VERSION=`cat /etc/os-release | grep VERSION | grep -v ID | cut -d '"' -f 2`
if [ $RASPIAN_VERSION_ID -ne 8 ] && [ $RASPIAN_VERSION_ID -ne 9 ]; then
    echo "Warning: it looks like your Raspberry Pi is not running Raspian (Jessie)"
    echo "or Raspian (Stretch). TJBot has only been tested on these versions of"
    echo "Raspian."
    echo ""
    read -p "Would you like to continue with setup? [Y/n] " choice </dev/tty
    case "$choice" in
        "n" | "N")
            echo "OK, TJBot software will not be installed at this time."
            exit
            ;;
        *) ;;
    esac
fi

#----setting TJBot name
CURRENT_HOSTNAME=`cat /etc/hostname | tr -d " \t\n\r"`
echo ""
echo "Please enter a name for your TJBot. This will be used for the hostname of"
echo "your Raspberry Pi."
read -p "TJBot name (current: $CURRENT_HOSTNAME): " name </dev/tty
name=$(echo "$name" | tr -d ' ')
if [ -z $name ]; then
    name=$CURRENT_HOSTNAME
fi
echo "Setting DNS hostname to $name"
echo "$name" | tee /etc/hostname >/dev/null 2>&1
sed -i "s/127.0.1.1.*$CURRENT_HOSTNAME/127.0.1.1\t$name/g" /etc/hosts

#----disabling ipv6
echo ""
echo "In some networking environments, disabling ipv6 may help your Pi get on"
echo "the network."
read -p "Disable ipv6? [y/N] " choice </dev/tty
case "$choice" in
    "y" | "Y")
        echo "Disabling ipv6"
        echo " ipv6.disable=1" | tee -a /boot/cmdline.txt
        echo "ipv6 has been disabled. It will take effect after rebooting."
        ;;
    *) ;;
esac

#----setting DNS to Quad9
echo ""
echo "In some networking environments, using Quad9's nameservers may speed up"
echo "DNS queries and provide extra security and privacy."
read -p "Enable Quad9 DNS? [y/N]: " choice </dev/tty
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

#----setting local to US
echo ""
read -p "Force locale to US English (en-US)? [y/N] " choice </dev/tty
case "$choice" in
    "y" | "Y")
        echo "Forcing locale to en-US. Please ignore any errors below."
        export LC_ALL="en_US.UTF-8"
        echo "en_US.UTF-8 UTF-8" | tee -a /etc/locale.gen
        locale-gen en_US.UTF-8
        ;;
    *) ;;
esac

#----update raspberry
echo ""
echo "TJBot requires an up-to-date installation of your Raspberry Pi's operating"
echo "system software. If you have never done this before, it can take up to an"
echo "hour or longer."
read -p "Proceed with apt-get dist-upgrade? [Y/n] " choice </dev/tty
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

#----nodejs install
NODE_VERSION=$(node --version 2>&1)
NODE_LEVEL=$(node --version 2>&1 | cut -d '.' -f 1 | awk '{print substr($0,2,1)}')

# Node.js version 6 for Jessie
if [ $RASPIAN_VERSION_ID -eq 8 ]; then
    RECOMMENDED_NODE_LEVEL="6"
# Node.js version 9 for Stretch
elif [ $RASPIAN_VERSION_ID -eq 9 ]; then
    RECOMMENDED_NODE_LEVEL="9"
# Node.js version 9 for anything else
else
    RECOMMENDED_NODE_LEVEL="9"
fi

echo ""
if [ $NODE_LEVEL -ge $RECOMMENDED_NODE_LEVEL ]; then
    echo "Node.js version $NODE_VERSION is installed, which is the recommended version for"
    echo "Raspian $RASPIAN_VERSION. Congratulations!"
else
    echo "Node.js version $NODE_VERSION is currently installed. We recommend installing"
    echo "Node.js version $RECOMMENDED_NODE_LEVEL for Raspian $RASPIAN_VERSION."

    read -p "Would you like to install a newer version of Node.js? [Y/n] " choice </dev/tty
    case "$choice" in
        "" | "y" | "Y")
            read -p "Which version of Node.js would you like to install? [6/7/8/9] " node_version </dev/tty
            case "$node_version" in
                "6" | "7" | "8" | "9")
                    curl -sL https://deb.nodesource.com/setup_${node_version}.x | sudo bash -
                    apt-get install -y nodejs
                    ;;
                *)
                    echo "Invalid Node.js version specified, Node.js will not be upgraded at this time."
                    ;;
            esac
            ;;
        *)
            echo "Warning: TJBot will encounter problems with versions of Node.js older than 6.x."
            ;;
    esac
fi

#----install additional packages
echo ""
if [ $RASPIAN_VERSION_ID -eq 8 ]; then
    echo "Installing additional software packages for Jessie (alsa, libasound2-dev, git, pigpio)"
    apt-get install -y alsa-base alsa-utils libasound2-dev git pigpio
#elif [ $RASPIAN_VERSION -eq 9 ]; then
#    echo "Installing additional software packages for Stretch (libasound2-dev)"
#    apt-get install -y libasound2-dev
fi

#----remove outdated apt packages
echo ""
echo "Removing unused software packages [apt-get autoremove]"
apt-get -y autoremove

#----enable camera on raspbery pi
echo ""
echo "If your Raspberry Pi has a camera installed, TJBot can use it to see."
read -p "Enable camera? [y/N] " choice </dev/tty
case "$choice" in
    "y" | "Y")
        if grep "start_x=1" /boot/config.txt
        then
            echo "Camera is alredy enabled."
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
read -p "Where should we clone it to? (default: /home/pi/Desktop/tjbot): " TJBOT_DIR </dev/tty
if [ -z $TJBOT_DIR ]; then
    TJBOT_DIR='/home/pi/Desktop/tjbot'
fi

if [ ! -d $TJBOT_DIR ]; then
    echo "Cloning TJBot project to $TJBOT_DIR"
    sudo -u $SUDO_USER git clone https://github.com/ibmtjbot/tjbot.git $TJBOT_DIR
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
read -p "Disable sound kernel modules? [Y/n] " choice </dev/tty
case "$choice" in
    "" | "y" | "Y")
        echo "Disabling the kernel modules for the built-in audio jack."
        cp $TJBOT_DIR/bootstrap/tjbot-blacklist-snd.conf /etc/modprobe.d/
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
read -p "Press enter to continue" nonce </dev/tty

#——instructions for watson credentials
echo ""
echo "Notice about Watson services: Before running any recipes, you will need"
echo "to obtain credentials for the Watson services used by those recipes."
echo "You can obtain these credentials as follows:"
echo ""
echo "1. Sign up for a free IBM Bluemix account at https://bluemix.net if you do
not have one already."
echo "2. Log in to Bluemix and create an instance of the Watson services you plan
to use. The Watson services are listed on the Bluemix dashboard, under
\"Catalog\". The full list of Watson services used by TJBot are:"
echo "Assistant, Language Translator, Speech to Text, Text to Speech,"
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
read -p "Press enter to continue" nonce </dev/tty

#----tests
echo ""
echo "TJBot includes a set of hardware tests to ensure all of the hardware is"
echo "functioning properly. If you have made any changes to the camera or"
echo "sound configuration, we recommend rebooting first before running these"
echo "tests as they may fail. You can run these tests at anytime by running"
echo "the runTests.sh script in the tjbot/bootstrap folder."
echo ""
read -p "Would you like to run hardware tests at this time? [y/N] " choice </dev/tty
case "$choice" in
    "y" | "Y")
        $TJBOT_DIR/bootstrap/runTests.sh $TJBOT_DIR
        ;;
    *) ;;
esac

#----reboot
echo ""
read -p "We recommend rebooting for all changes to take effect. Reboot? [Y/n] " choice </dev/tty
case "$choice" in
    "" | "y" | "Y")
        echo "Rebooting."
        reboot
        ;;
    *)
        echo "Please reboot your Raspberry Pi for all changes to take effect."
        ;;
esac
