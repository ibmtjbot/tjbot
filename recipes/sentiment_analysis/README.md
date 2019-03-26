# Sentiment Analysis
> Make your robot respond to emotions

This recipe uses the [Watson Tone Analyzer](https://www.ibm.com/watson/services/tone-analyzer/) service to shine TJBot’s LED different colors based on the emotions present in Twitter for a given keyword. It also uses the [Twitter API](https://dev.twitter.com/overview/api) to fetch tweets.

## Hardware
This recipe requires a TJBot with an LED.

## Build and Run
First, make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

Next, go to the `recipes/sentiment_analysis` folder and install the dependencies.

    $ cd tjbot/recipes/sentiment_analysis
    $ npm install

Create an instance of the [Watson Tone Analyzer](https://www.ibm.com/watson/services/tone-analyzer/) service and note the authentication credentials.

Create a set of [Twitter developer credentials](https://developer.twitter.com/en/apps) and note the consumer key, consumer secret, access token key, and access token secret.

Make a copy of the default configuration file and update it with the Watson service credentials.

    $ cp config.default.js config.js
    $ nano config.js
    <enter your credentials in the specified places>

Run!

    sudo node sentiment.js

> Note the `sudo` command. Root user access is required to run TJBot recipes.

At this point, TJBot will begin listening to Twitter for tweets containing the specified keyword (specified in `exports.sentiment_keyword`). It may take some time to collect enough tweets to perform sentiment analysis, so please be patient.

## Customize
Change the keyword TJBot monitors by editing `config.js` and changing the line

    exports.sentiment_keyword = "education"; // keyword to monitor in Twitter

You can also change the colors that TJBot shines. The table below shows the colors that TJBot shines for each emotion.

| Emotion | Color |
| --- | --- |
| Anger | Red |
| Joy | Yellow |
| Fear | Magenta |
| Sadness | Blue |

You can change these colors by editing the `shineForEmotion()` function.

Also note that the Tone Analyzer API returns three language tones: `analytical`, `confident`, and `tentative`. Try modifying the recipe to do something new depending on which language tone is dominant.

> 💡 Hint: you may want to eliminate the `filter()` on `tone.document_tone.tones` to be able to examine the language tones.

## Troubleshoot
If the LED does not light up, you can try moving the power from 3.3 to 5 volts. If neither the 3.3v or 5v pins work, you will need a 1N4001 diode. The diode is inserted between the power pin of the LED (the shorter of the two middle pins) and the 5v pin on the Raspberry Pi.

If the LED shows the wrong color, or flashes different colors very rapidly, it may be due to interference with the built-in audio hardware. Depending on your configuration of Raspbian, the sound drivers may be more aggressive in taking away control of GPIO 18 from other processes. If your LED shows random colors instead of the expected color, use this trick to fix it.

    sudo cp bootstrap/tjbot-blacklist-snd.conf /etc/modprobe.d/
    sudo update-initramfs -u
    sudo reboot

After TJBot finishes rebooting, confirm no "snd" modules are running.

    lsmod

If you have additional difficulties not covered in this guide, please refer to [Adafruit's NeoPixel on Raspbeery Pi guide](https://learn.adafruit.com/neopixels-on-raspberry-pi/overview) to troubleshoot.

# Watson Services
- [Watson Tone Analyzer](https://www.ibm.com/watson/services/tone-analyzer/)

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

# Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
