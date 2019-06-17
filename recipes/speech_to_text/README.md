# Speech to Text
> Control TJBot's LED with your voice!

This recipe uses the [Speech to Text](https://www.ibm.com/watson/services/speech-to-text/) service to let you control the color of TJBot's LED with your voice. For example, if you say "turn the light green," TJBot will change the color of the LED to green.

## Hardware
This recipe requires a TJBot with a microphone and an LED.

## Build and Run
First, make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

Next, go to the `recipes/speech_to_text` folder and install the dependencies.

    $ cd tjbot/recipes/speech_to_text
    $ npm install

Create an instance of the [Speech to Text](https://www.ibm.com/watson/services/speech-to-text/) service and note the authentication credentials.

Make a copy of the default configuration file and update it with your credentials.

    $ cp config.default.js config.js
    $ nano config.js
    <enter your credentials in the specified places>

Run!

    sudo node stt.js

> Note the `sudo` command. Root user access is required to run TJBot recipes.

Now talk to your microphone to change the color of the LED. Say "turn the light blue" to change the light to blue. You can try other colors as well, such as yellow, green, orange, purple, magenta, red, blue, aqua, and white. You can also say "turn the light on" or "turn the light off".

## Customize
We have hidden a disco party for you. Find the code for disco party in `stt.js` and uncomment the code (hint: there are two places that need to be uncommented). Now you can ask TJ to show you the disco lights by saying "Let's have a disco party"!

Try implementing your own TJBot party and share it with us #TJBot!

## Troubleshoot
If the LED does not light up, you can try moving the power from 3.3 to 5 volts. If neither the 3.3v or 5v pins work, you will need a 1N4001 diode. The diode is inserted between the power pin of the LED (the shorter of the two middle pins) and the 5v pin on the Raspberry Pi.

If the LED shows the wrong color, or flashes different colors very rapidly, it may be due to interference with the built-in audio hardware. Depending on your configuration of Raspbian, the sound drivers may be more aggressive in taking away control of GPIO 18 from other processes. If your LED shows random colors instead of the expected color, use this trick to fix it.

    sudo cp bootstrap/tjbot-blacklist-snd.conf /etc/modprobe.d/
    sudo update-initramfs -u
    sudo reboot

After TJBot finishes rebooting, confirm no "snd" modules are running.

    lsmod

If you have additional difficulties not covered in this guide, please refer to [Adafruit's NeoPixel on Raspbeery Pi guide](https://learn.adafruit.com/neopixels-on-raspberry-pi/overview) to troubleshoot.

# AI Services
- [Speech to Text](https://www.ibm.com/watson/services/speech-to-text/)

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

# Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
