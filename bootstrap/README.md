# TJBot Bootstrap

Perform the following operations to prepare your Raspberry Pi for becoming a TJBot.

**Note: This is coming soon as a shell script. Stay tuned.**

1. Boot your Pi and connect to Wifi (click the icon in the menu bar)

2. Upgrade your Pi’s OS

```
sudo apt-get update
sudo apt-get dist-upgrade
```

> You’ll need to do `apt-get update` first because that updates the repository cache. Otherwise, `apt-get dist-upgrade` won't do anything because it doesn't know there is a distribution upgrade.

> During the upgrade, say "Y" when prompted to replace the `lightdm.conf` file with the package maintainers version.

If you have plugged in your speaker via USB or Bluetooth, disable the kernel modules for the built-in audio jack.

```
sudo cp bootstrap/tjbot-blacklist-snd.conf /etc/modprobe.d/
sudo update-initramfs -u
```

If you have plugged in your speaker via the headphone jack, you may experience interference between the speaker and the LED when using both simultaneously. In this case, do not disable the kernel modules for the built-in audio jack.

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

```
cd ~/Desktop/tjbot/recipes/speech_to_text
npm install
cp config.default.js config.js
<edit config.js to add your Watson credentials>
sudo node stt.js
```

## Hardware Tests
Hardware tests are included with bootstrap to ensure the TJBot hardware is set up correctly. Tests are included for the `camera`, `led`, `servo`, and `speaker`.

Tests can be run in the following manner.

```
$ npm install
$ sudo node test/test.camera.js
$ sudo node test/test.led.js
$ sudo node test/test.servo.js
$ sudo node test/test.speaker.js
```
