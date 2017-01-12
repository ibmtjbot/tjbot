# Speech to Text
> Use your voice to control a LED with [Watson](https://www.ibm.com/watson/developercloud/speech-to-text.html)

This module provides a Node.js code to control a [8mm NeoPixel RGB led](https://www.adafruit.com/products/1734) using voice commands. For example, you may say "Turn the light green" to change the color of the LED to green.

**This will only run on the Raspberry Pi.**

[![link to a full video for use voice to control LED](https://img.youtube.com/vi/Wvnh7ie3D6o/0.jpg)](https://www.youtube.com/watch?v=Wvnh7ie3D6o)

##How It Works
- Listens for the voice commands (e.g "turn the light green")
- Sends audio from the microphone to the [Watson Speech to Text Service - STT](https://www.ibm.com/watson/developercloud/speech-to-text.html) to convert to text
- Parses the text to identify the given voice command
- Switches the LED on/off depending on the given command

##Hardware

Check out [this instructable] (http://www.instructables.com/id/Use-Your-Voice-to-Control-a-Light-With-Watson/) for wiring diagrams and instructions to prepare your system. You will need a Raspberry Pi 3, a microphone, a [8mm NeoPixel RGB LED] (https://www.adafruit.com/products/1734), 3 Female/female jumper wires, and [the TJBot cardboard](http://ibm.biz/mytjbot).

##Build
> We recommend starting with [our step by step instructions](http://www.instructables.com/id/Use-Your-Voice-to-Control-a-Light-With-Watson/) to build this recipe.

Get the sample code and go to the application folder.  Please see this [instruction on how to clone](https://help.github.com/articles/cloning-a-repository/) a repository.

    cd recipes/speech_to_text

Install ALSA tools (required for recording audio on Raspberry Pi)

    sudo apt-get install alsa-base alsa-utils

Install Dependencies

    npm install

Add your Bluemix Speech to text service credentials

    edit config.js
    enter your watson stt username, password and version.

##Testing the LED
The wiring diagram is [here] (http://www.instructables.com/id/Use-Your-Voice-to-Control-a-Light-With-Watson/).

Before running the code, you may test your LED setup to make sure the connections are correct and the library is properly installed. When you run this module, it should turn your LED on.

    sudo node led_test.js

> Note the `sudo` command. Root user access is required to control the NeoPixel LEDs.

If the LED does not light up, you can try moving the power from 3.3 to 5 volts.  If neither the 3.3v or 5v pins work, you will need a 1N4001 diode.  The diode is inserted between the power pin of the LED (the shorter of the two middle pins) and the 5v pin on the Raspberry Pi.

If you have problems with the setup, please refer to [Adafruit's NeoPixel on Raspbeery Pi guide](https://learn.adafruit.com/neopixels-on-raspberry-pi/overview) to troubleshoot.

##Running

Start the application

    sudo node stt.js   

> Note the `sudo` command. Root user access is required to control the NeoPixel LEDs.

Now talk to your microphone to change the color of the LED.
Say  "Turn the light blue" to change the light to blue. You can try other colors: yellow, green, orange, purple, magenta, red, blue, aqua, white). You can either say "Turn the light on" or "Turn the light off"!

Doesn't your Pi show the right color? No worries, we can fix it.
The LED library uses the PWM module (GPIO 18) to drive the data line of the LEDs. This conflicts with the built-in audio hardware, which uses the same pin to drive the audio output. Depending on your configuration of Raspbian, the sound drivers may be more aggressive in taking away control of GPIO 18 from other processes. If your LED shows random colors instead of the expected color, use this trick to fix it.

    sudo cp blacklist-rgb-led.conf /etc/modprobe.d/
    sudo update-initramfs -u

Reboot and confirm no "snd" modules are running by executing the command "lsmod".

    lsmod    

##Customization
You can add new colors to your color palette in stt.js. TJBot uses a NeoPixel RGB LED, which means it can show any combination of red, green, and blue.

We have hidden a disco party for you. Find the code for disco party in stt.js and uncomment the code. Now you can ask TJ to show you the disco lights by saying "Let's have a disco party"!

Try implementing your own TJBot party and share it with us #TJBot!

Once ready to move on, try the next recipe to [make TJBot respond to emotions using Watson](../sentiment_analysis).

##Dependencies

- [Watson Speech to Text](https://www.ibm.com/watson/developercloud/speech-to-text.html)
- mic npm package for reading audio input
- [rpi-ws281x-native](https://github.com/beyondscreen/node-rpi-ws281x-native) npm package to control a ws281x LED.

## Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
