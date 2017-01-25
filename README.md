# IBM TJBot
<img src="/images/tjbot.jpg" width="85%">

[IBM Watson Maker Kits](http://ibm.biz/mytjbot) are a collection of DIY open source templates to connect to [Watson services](https://www.ibm.com/watson/developercloud/services-catalog.html) in a fun way. [IBM TJBot](http://ibm.biz/mytjbot) is the first maker kit in the collection. You can 3D print or laser cut the robot frame, then use one of the available [recipes](recipes) to bring him to life!

Better still, you can create your own custom recipes to bring exciting ideas to life using any combination of Watson's Cognitive API's!

**TJBot will only run on Raspberry Pi.**

# Get TJBot
You can download [the design files](https://ibmtjbot.github.io/#gettj) and 3D print or laser cut TJBot. 
[Here is an instructable](http://www.instructables.com/id/Build-TJ-Bot-Out-of-Cardboard/) to help you with the details.

# Bring TJBot to life
[Recipes](recipes) are step by step instructions to help you connect your TJBot to [Watson services](https://www.ibm.com/watson/developercloud/services-catalog.html).
The [recipes](recipes) are designed based on a Raspberry Pi. You can either run one of the available [recipes](recipes) or create your own recipe that brings sweet ideas to life using any combination of [Watson API](https://www.ibm.com/watson/developercloud/services-catalog.html)!

We have provided three initial [recipes](recipes) for you:
- Use your voice to control a light with Watson [[instructions](http://www.instructables.com/id/Use-Your-Voice-to-Control-a-Light-With-Watson/)] [[github](https://github.com/ibmtjbot/tjbot/tree/master/recipes/speech_to_text)]
- Make your robot respond to emotions using Watson [[instructions](http://www.instructables.com/id/Make-Your-Robot-Respond-to-Emotions-Using-Watson/)] [[github](https://github.com/ibmtjbot/tjbot/tree/master/recipes/sentiment_analysis)]
- Build a talking robot with Watson Conversation [[instructions](http://www.instructables.com/id/Build-a-Talking-Robot-With-Watson-and-Raspberry-Pi/)] [[github](https://github.com/ibmtjbot/tjbot/tree/master/recipes/conversation)]

Here are some of the featured recipes created by TJBot enthusiasts:
- Fun controller recipe for TJBot's servo arm [[instructions](http://www.instructables.com/id/Build-a-Waving-Robot-Using-Watson-Services/)] [[github](https://github.com/victordibia/tjwave)]
- SwiftyTJ that enables TJBot’s LED to be controlled from a Swift program [[github](https://github.com/jweisz/swifty-tj)]
- Build a TJBot that cares [[instructions](https://medium.com/ibm-watson-developer-cloud/build-a-chatbot-that-cares-part-1-d1c273e17a63#.6sg1yfh4w)] [[github](https://github.com/boxcarton/tjbot-raspberrypi-nodejs)]
- Project Intu, not a recipe but a middleware that can be installed on TJBot and be used to architect more complex interactions for your robot [[developercloud](http://www.ibm.com/watson/developercloud/project-intu.html)] [[github](https://github.com/watson-intu/self-sdk#raspberry-pi)]

# Contribute to TJBot
TJBot is open source and we'd love to see what you can make with him. Here are some ideas to get you started.

    - Visual recognition. TJBot has a placeholder behind his left eye to insert a Raspberry Pi camera. Try connecting the camera to the Watson Visual Recognition API so TJ can say hello when he sees you.

    - IoT. The Watson IoT service lets you control smart home devices (e.g. Philips Hue, LIFX lights, etc. ). Connect TJBot to IoT and have him control your home.

    - Connected robots. You can program multiple TJBots to send messages to each other using the Watson IoT platform.

If you have created your own recipe, we would love to include it as a [featured recipe](featured/README.md)! Just submit a pull request for your receipe instructions and code and send a link to a demo video to tjbot@us.ibm.com (Vimeo & YouTube preferred). We will review it and if we decide to include it in our repository, you'll be listed as the developer. See [CONTRIBUTING.md](CONTRIBUTING.md).

We cannot wait to see what you build with [TJBot](http://ibm.biz/mytjbot)!

# About TJBot
[TJ](http://ibm.biz/mytjbot) is affectionately named after Thomas J. Watson, the first Chairman and CEO of IBM. TJBot was born at IBM Research as an experiment to find the best practices in the design and implementation of cognitive objects.

Feel free to contact TJBot at tjbot@us.ibm.com

## License
This library uses the [Apache License Version 2.0 software license] (LICENSE).
