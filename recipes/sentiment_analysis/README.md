# Sentiment Analysis
> Make your robot respond to emotions

This recipe uses the [Tone Analyzer](https://www.ibm.com/watson/services/tone-analyzer/) service to shine TJBot’s LED different colors based on the emotions present in Twitter for a given keyword. It also uses the [Twitter API](https://dev.twitter.com/overview/api) to fetch tweets.

## Hardware
This recipe requires a TJBot with a Neopixel LED.

> 💡 If you have a Common Anode LED, change `TJBot.HARDWARE.LED_NEOPIXEL` to `TJBot.HARDWARE.LED_COMMON_ANODE` in `sentiment.js`

> 📌 By default, TJBot expects Neopixel LEDs to be connected to GPIO PIN 18 and Common Anode LEDs to be connected to GPIO pins 19 (red), 13 (green), and 12 (blue). You may set which pins your LED is connected to by uncommenting the `tjConfig.shine = {...}` code block. See [https://pinout.xyz](https://pinout.xyz) for a complete pin diagram.

## Build and Run
First, make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

Next, go to the `recipes/sentiment_analysis` folder and install the dependencies.

    $ cd tjbot/recipes/sentiment_analysis
    $ npm install

Create an instance of the [Tone Analyzer](https://www.ibm.com/watson/services/tone-analyzer/) service and download the authentication credentials file. Ensure this file is named `ibm-credentials.env` and place it in the `tjbot/recipes/sentiment_analysis` folder.

Create a set of [Twitter developer credentials](https://developer.twitter.com/en/apps) and note the consumer key, consumer secret, access token key, and access token secret.

Make a copy of the default configuration file and update it with the your service credentials.

    $ cp config.default.js config.js
    $ nano config.js
    <enter your credentials in the specified places>

Run!

    $ sudo node sentiment.js

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
If you are having difficulties in making this recipe work, please see the [troubleshooting guide](../../TROUBLESHOOTING.md).

# Watson Services
- [Tone Analyzer](https://www.ibm.com/watson/services/tone-analyzer/)

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

# Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
