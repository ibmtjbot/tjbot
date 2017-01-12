
# Recipes
Recipes are step by step instructions to help you connect your TJBot to [Watson cognitive services](https://www.ibm.com/watson/developercloud/services-catalog.html).
The recipes are designed to be run on a Raspberry Pi. You can either run one of the available recipes or create your own recipe that brings sweet ideas to life using any combination of [Watson API](https://www.ibm.com/watson/developercloud/services-catalog.html)!

### [Speech to Text](speech_to_text)
> Use your voice to control a LED with Watson [[instructables](http://www.instructables.com/id/Use-Your-Voice-to-Control-a-Light-With-Watson/)] [[github](https://github.com/ibmtjbot/tjbot/tree/master/recipes/speech_to_text)]

This module provides a Node.js code to control a [8mm NeoPixel RGB led](https://www.adafruit.com/products/1734) using voice commands. It uses [Watson Speech to Text API](https://www.ibm.com/watson/developercloud/speech-to-text.html).

[![link to a full video for use voice to control LED](https://img.youtube.com/vi/Wvnh7ie3D6o/0.jpg)](https://www.youtube.com/watch?v=Wvnh7ie3D6o)

###[Sentiment Analysis](sentiment_analysis)
> Make your bot respond to emotions using Watson [[instructables](http://www.instructables.com/id/Make-Your-Robot-Respond-to-Emotions-Using-Watson/)] [[github](https://github.com/ibmtjbot/tjbot/tree/master/recipes/sentiment_analysis)]

This module provides Node.js code to control the color of a [8mm NeoPixel RGB led](https://www.adafruit.com/products/1734) based on public perception of a given keyword (e.g. "heart" or "iPhone"). The module connects to Twitter to analyze the public sentiment about the given keyword in real time, and updates the color of the LED to reflect the sentiment. It uses [Watson Tone Analyzer](http://www.ibm.com/watson/developercloud/tone-analyzer.html) and Twitter API.

<img src="../images/sentiment.png" width="50%">

###[Conversation](conversation)
> Build a talking robot with Watson [[instructables](http://www.instructables.com/id/Build-a-Talking-Robot-With-Watson-and-Raspberry-Pi/)] [[github](https://github.com/ibmtjbot/tjbot/tree/master/recipes/conversation)]

This module provides Node.js code to get your Raspberry Pi to talk. It uses [Watson Speech to Text](https://www.ibm.com/watson/developercloud/speech-to-text.html) to parse audio from the microphone, uses [Watson Conversation](https://www.ibm.com/watson/developercloud/conversation.html) to generate a response, and uses [Watson Text to Speech](https://www.ibm.com/watson/developercloud/text-to-speech.html) to "read" out this response!

<img src="../images/conversation.png" width="50%">

## Featured Recipes
Check out some [featured TJ Bot recipes](../featured/README.md) created by the community.

## Contributing Your Own Recipes
TJ Bot is open source and we'd love to see what you can make with him. If you have created your own recipe, we would love to include it as a [featured recipe](../featured/README.md)! Just submit a pull request for your recipe instructions and code and send a link to a demo video to tjbot@us.ibm.com (Vimeo & YouTube preferred). We will review it and if we decide to include it in our repository, you'll be listed as the developer. See [CONTRIBUTING.md](../CONTRIBUTING.md).

We cannot wait to see what you build with TJBot!
