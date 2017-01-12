# Sentiment Analysis

> Make your robot respond to emotions using [Watson](http://www.ibm.com/watson/developercloud/tone-analyzer.html)

This module provides Node.js code to control the color of a [8mm NeoPixel RGB led](https://www.adafruit.com/products/1734) based on public perception of a given keyword (e.g. "heart" or "iPhone"). The module connects to Twitter to analyze the public sentiment about the given keyword in real time, and updates the color of the LED to reflect the sentiment.

**This will only run on the Raspberry Pi.**

[![link to a full video for use voice to control LED](https://img.youtube.com/vi/KU8DNzZNdBY/0.jpg)](https://www.youtube.com/watch?v=KU8DNzZNdBY)

##How It Works
- Connects to the Twitter Streaming service and listens for tweets related to a given search keyword
- Sends tweets to the Watson Tone Analyzer service to determine the emotions contained in them
- Changes the color of the LED based on the emotions found by Watson

##Hardware
Check out [this instructable] (http://www.instructables.com/id/Make-Your-Robot-Respond-to-Emotions-Using-Watson/) to get the wiring diagram and prepare your system. You will need a Raspberry Pi 3, a [8mm NeoPixel RGB LED] (https://www.adafruit.com/products/1734), 3 Female/female jumper wires, and [the TJBot cardboard](http://ibm.biz/mytjbot) 

##Build
>We recommend starting with [our step by step instructions](http://www.instructables.com/id/Make-Your-Robot-Respond-to-Emotions-Using-Watson/) to build this recipe.

Get the sample code and go to the application folder.  Please see this [instruction on how to clone](https://help.github.com/articles/cloning-a-repository/) a repository.

    cd recipes/sentiment_analysis

Install Dependencies

    npm install

Add your Bluemix Tone Analyzer credentials

    edit config.js
    enter your Watson Tone Analyzer username, password and version.

Since this module will be sourcing the text from Twitter, you will need valid [Twitter developer credentials](https://apps.twitter.com/) in the form of a set of consumer and access tokens/keys.

Add your Twitter credentials

    edit config.js
    enter your Twitter credentials.

##Testing the LED
The wiring diagram is [here] (http://www.instructables.com/id/Make-Your-Robot-Respond-to-Emotions-Using-Watson/).
Before running the code, you may test your LED setup to make sure the connections are correct and the library is properly installed. When you run this test module, it should turn on your LED.

    sudo node led_test.js

> Note the `sudo` command. Root user access is required to control the NeoPixel LEDs.

If the LED does not light up, you can try moving the power from 3.3 to 5 volts. If neither the 3.3v or 5v pins work, you will need a 1N4001 diode.  The diode is inserted between the power pin of the LED (the shorter of the two middle pins) and the 5v pin on the Raspberry Pi.

If you have problems with the setup, please refer to [Adafruit's Neopixel on Raspbeery Pi guide](https://learn.adafruit.com/neopixels-on-raspberry-pi/overview
) to troubleshoot.

##Running

Start the application

    sudo node sentiment.js

> Note the sudo command. Root user access is required to control the NeoPixel LEDs.

Doesn't your Pi show the right color? No worries, we can fix it. The LED library uses the PWM module (GPIO 18) to drive the data line of the LEDs. This conflicts with the built-in audio hardware, which uses the same pin to drive the audio output. Depending on your configuration of Raspbian, the sound drivers may be more aggressive in taking away control of GPIO 18 from other processes. If your LED shows random colors instead of the expected color, use this trick to fix it.

	sudo cp blacklist-rgb-led.conf /etc/modprobe.d/
	sudo update-initramfs -u

Reboot and confirm no "snd" modules are running by executing the command "lsmod".

	lsmod    

## Customization
The default sentiment keyword is set to 'people' but you can change it from config.js:

    edit config.js
    Update searchkeyword
    searchkeyword = "people";

The default behaviour of the module assigns the following colors to sentiments.

| Emotion | Color |
| --- | --- |
| Anger | Red |
| Joy | Yellow |
| Fear | Purple |
| Disgust | Green |
| Sadness | Blue |

You can change this mapping by editing `sentiment.js` to add your favorite colors. Note that colors are specified using the hexademical format.

	var red = 0x00ff00 ;
	var green = 0xff0000 ;
	var blue = 0x0000ff ;
	var yellow = 0xffff00 ;
	var purple = 0x00ffff ;

	function processEmotion(emotion){
		console.log("Current Emotion Around " + searchkeyword + " is ", emotion.tone_id);
		if (emotion.tone_id == "anger"){
			setLED(red);
		}else if(emotion.tone_id == "joy"){
			setLED(yellow);
		}else if(emotion.tone_id == "fear"){
			setLED(purple);
		}else if(emotion.tone_id == "disgust"){
			setLED(green);
		}else if(emotion.tone_id == "sadness"){
			setLED(blue);
		}
	}

#Dependencies
- [Watson Tone Analyzer](http://www.ibm.com/watson/developercloud/tone-analyzer.html).
- Twitter npm package : An asynchronous client library for the Twitter REST and Streaming API's.
- [rpi-ws281x-native](https://github.com/beyondscreen/node-rpi-ws281x-native) - npm package for controling a ws281x LED.

## Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
