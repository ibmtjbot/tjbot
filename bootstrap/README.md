# TJBot Bootstrap

Perform the following operations to prepare your Raspberry Pi for becoming a TJBot.

**BY SCRIPT**
1. Boot your Pi and connect to Wifi (click the icon in the menu bar)

2. Run the command below:

    curl -sL http://ibm.biz/tjbot-bootstrap | bash -

**MANUALLY:**
1. Boot your Pi and connect to Wifi (click the icon in the menu bar)

2. Upgrade your Pi’s OS

```
sudo apt-get update
sudo apt-get dist-upgrade
```

> You’ll need to do `apt-get update` first because that updates the repository cache. Otherwise, `apt-get dist-upgrade` won't do anything because it doesn't know there is a distribution upgrade.

> During the upgrade, say "Y" when prompted to replace the `lightdm.conf` file with the package maintainers version.


There is a known issue with interference between audio output on the headphone jack and a connected LED when they are used simultaneously (garbled audio and incorrect LED colors). To address this we recommend that you use USB audio instead of your headphone jack and *also* disable the disable the kernel modules for the built-in audio jack.

Thus, if you are using USB audio (via a [USB converter](https://www.amazon.com/Virtual-Channel-Audio-Adapter-Notebook/dp/B00M3UWE3Q/)) or Bluetooth, use the following snippet to disable the kernel modules for the built-in audio jack. This copies a configuration file (tjbot-blacklist-snd.conf) to the `/etc/modeprob.d` directory.

```
sudo cp bootstrap/tjbot-blacklist-snd.conf /etc/modprobe.d/
sudo update-initramfs -u
```

If you do not have a USB converter, you may still use your onboard audio jack but will experience the interference mentioned above. To re-enable the onboard audio module if you have disabled it previously, simply delete the (tjbot-blacklist-snd.conf) file from the `/etc/modeprob.d` directory.

```
sudo rm /etc/modprobe.d/tjbot-blacklist-snd.conf
sudo update-initramfs -u
```

3. Reboot

```
sudo reboot
```

4. Remove old conf files from `/home/pi/oldconffiles` if they are present

```
rm -rf ~/oldconffiles
```

5. Remove unneeded packages and install missing ALSA packages

```
sudo apt-get autoremove
sudo apt-get install alsa-base alsa-utils libasound2-dev
```

6. Install Node.js

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

7. Check out the TJBot source code

```
cd ~/Desktop
git clone https://github.com/ibmtjbot/tjbot
```

8. Run a recipe


    cd ~/Desktop/tjbot/recipes/conversation
    npm install
    sudo node conversation.js


## Hardware Tests
Hardware tests are included with bootstrap to ensure the TJBot hardware is set up correctly. Tests are included for the `camera`, `led`, `servo`, and `speaker` in the `tjbot/bootstrap/tests` folder.

Navigate to the tests folder and install its dependecies

```
cd tests
npm install
```

Tests can be run in the following manner.

```
sudo node test.camera.js
sudo node test.led.js
sudo node test.servo.js
sudo node test.speaker.js
```
