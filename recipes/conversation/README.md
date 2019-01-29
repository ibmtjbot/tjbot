# Conversation
> Chat with TJBot!

This recipe uses the [Watson Assistant](https://www.ibm.com/watson/services/conversation/), [Watson Speech to Text](https://www.ibm.com/watson/services/speech-to-text/), and [Watson Text to Speech](https://www.ibm.com/watson/services/text-to-speech/) services to turn TJ into a chatting robot.

## Hardware
This recipe requires a TJBot with a microphone and a speaker.

## Build and Run
First, make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

Next, go to the `recipes/conversation` folder and install the dependencies.

    $ cd tjbot/recipes/conversation
    $ npm install

Create instances of the [Watson Assistant](https://www.ibm.com/watson/services/conversation/), [Watson Speech to Text](https://www.ibm.com/watson/services/speech-to-text/), and [Watson Text to Speech](https://www.ibm.com/watson/services/text-to-speech/) services and note the authentication credentials.

Import the `workspace-sample.json` file into the Watson Assistant service and note the workspace ID.

Make a copy the default configuration file and update it with the Watson service credentials and the conversation workspace ID.

    $ cp config.default.js config.js
    $ nano config.js
    <enter your credentials and the conversation workspace ID in the specified places>

Run!

    sudo node conversation.js

> Note the `sudo` command. Root user access is required to run TJBot recipes.

Watson conversation uses intents to label the purpose of a sentence. For example when you ask TJBot "Please introduce yourself", the intent is to make an introduction. You can add your own new intents, but for now, we have started you off with a few intents:

- Introduction. You can say phrases such as "Watson, please introduce yourself", "Watson, who are you", and "Watson, can you introduce yourself"
- Joke. You can ask "Watson, please tell me a joke" or "Watson, I would like to hear a joke".

For a complete list, check the content of workspace-sample.json

An **attention word** is used so TJBot knows you are talking to him. The default attention word is 'Watson', but you can change it in config.js as follows. Update the configuration file to change the robot name in tjConfig section:

    // set up TJBot's configuration
    
    exports.tjConfig = {
        log: {   level: 'verbose'    },
        robot: {   name: 'tee jay bot'  }
    };

You can change the 'name' to whatever you would like to call your TJBot.

# Watson Services
- [Watson Assistant](https://www.ibm.com/watson/services/conversation/)
- [Watson Text to Speech](https://www.ibm.com/watson/services/text-to-speech/)
- [Watson Speech to Text](https://www.ibm.com/watson/services/speech-to-text/)

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

# Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
