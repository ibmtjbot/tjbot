# Conversation

> Build a talking robot with [Watson](https://www.ibm.com/watson/developercloud/conversation.html)

This module provides Node.js code to get your Raspberry Pi to talk. It uses [Watson Speech to Text](https://www.ibm.com/watson/developercloud/speech-to-text.html) to parse audio from the microphone, uses [Watson Conversation](https://www.ibm.com/watson/developercloud/conversation.html) to generate a response, and uses [Watson Text to Speech](https://www.ibm.com/watson/developercloud/text-to-speech.html) to "read" out this response!

**This will only run on the Raspberry Pi.**


## How It Works
- Listens for voice commands
- Sends audio from the microphone to the Watson Speech to Text Service - STT to transcribe [Watson Speech to Text](https://www.ibm.com/watson/developercloud/speech-to-text.html)
- Parses the text looking for the attention word
- Once the attention word is recognized, the text is sent to [Watson Conversation](https://www.ibm.com/watson/developercloud/conversation.html) to generate the response.
- The response is sent to [Watson Text to Speech](https://www.ibm.com/watson/developercloud/text-to-speech.html) to generate the audio file.
- The robot speaks the response via the Alsa audio playback tools

##Hardware
Check out [this instructable] (http://www.instructables.com/id/Build-a-Talking-Robot-With-Watson-and-Raspberry-Pi/) to prepare your system. You will need a Raspberry Pi 3, Microphone, Speaker, and [the TJBot cardboard](https://ibmtjbot.github.io/#gettj).

##Build
> We recommend starting with our [step by step instructions] (http://www.instructables.com/id/Build-a-Talking-Robot-With-Watson-and-Raspberry-Pi/) to build this recipe.

Get the sample code and go to the application folder.  Please see this [instruction on how to clone](https://help.github.com/articles/cloning-a-repository/) a repository.

    cd recipes/conversation

Install ALSA tools (required for recording audio on Raspberry Pi)

    sudo apt-get install alsa-base alsa-utils

Install Dependencies

    npm install

Set the audio output to your audio jack. For more audio channels, check the [config guide. ](https://www.raspberrypi.org/documentation/configuration/audio-config.md)

    amixer cset numid=3 1    
    // This sets the audio output to option 1 which is your Pi's Audio Jack. Option 0 = Auto, Option 2 = HDMI. An alternative is to type sudo raspi-config and change the audio to 3.5mm audio jack.

Update the Config file with your Bluemix credentials for all three Watson services.

    edit config.js
    enter your watson usernames, passwords and versions.

## Creating a Conversation Flow
You need to train your robot with what to say and when to say it. For that, we use [Watson Conversation] (https://www.ibm.com/watson/developercloud/conversation.html). Open a browser and go to [IBM Watson Conversation link](http://www.ibmwatsonconversation.com)
From the top right corner, select the name of your conversation service and click 'create' to create a new workspace for your robot. You can create intents and dialogs there. [Here](http://www.instructables.com/id/Build-a-Talking-Robot-With-Watson-and-Raspberry-Pi/#step6) is a step-by-step instructions to create a conversation flow.

##Running

Start the application

    node conversation.js

Then you should be able to speak to the microphone.
The robot gets better with training. You can go to your [Watson conversation module](http://www.ibmwatsonconversation.com) to train the robot with more intents and responses.

##Customization
The attention word is the word you say to get the attention of the robot.
The default attention word is set to 'Watson' but you can change it from config.js. Some words are easier for the robot to recognize. If decided to change the attention word, experiment with multiple words and pick the one that is easier for the robot to recognize.

The default voice of TJBot is set to a male voice (`en-US_MichaelVoice`) but you can change it from config.js. Two female voices are available for TJBot (`en-US_AllisonVoice` and `en-US_LisaVoice`).

    // The attention word to wake up the robot.
	exports.attentionWord ='watson';

	// You can change the voice of the robot to your favorite voice.
	exports.voice = 'en-US_MichaelVoice';
	// Some of the available options are:
	// en-US_AllisonVoice
	// en-US_LisaVoice
	// en-US_MichaelVoice (the default)

# Dependencies List

- Watson Developer Cloud - [Watson Speech to Text](https://www.ibm.com/watson/developercloud/speech-to-text.html), [Watson Conversation](https://www.ibm.com/watson/developercloud/conversation.html), and [Watson Text to Speech](https://www.ibm.com/watson/developercloud/text-to-speech.html).
- mic npm package : for reading audio input


## Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
