# Conversation
> Chat with TJBot!

This recipe uses the [Watson Assistant](https://www.ibm.com/watson/services/conversation/), [Speech to Text](https://www.ibm.com/watson/services/speech-to-text/), and [Text to Speech](https://www.ibm.com/watson/services/text-to-speech/) services to turn TJ into a chatting robot.

## Hardware
This recipe requires a TJBot with a microphone, a speaker, and optionally a camera.

## Build and Run
First, make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

Next, go to the `recipes/conversation` folder and install the dependencies.

    $ cd tjbot/recipes/conversation
    $ npm install

Create instances of the [Watson Assistant](https://www.ibm.com/watson/services/conversation/), [Speech to Text](https://www.ibm.com/watson/services/speech-to-text/), and [Text to Speech](https://www.ibm.com/watson/services/text-to-speech/) services and download the authentication credentials file for each service. Combine each of these files into a single file named `ibm-credentials.env` and place it in the `tjbot/recipes/translator` folder. See `ibm-credentials.sample.env` for an example.

Make a copy the default configuration file and update it with your service credentials and the conversation workspace ID.

    $ cp config.default.js config.js
    $ nano config.js
    <enter your credentials and the conversation workspace ID in the specified places>

Set up Watson Assistant using the following steps:

1. Launch the Watson Assistant tool and create a new assistant.
2. Click "Add dialog skill" and then "Import Skill."
3. Upload the `tjbot-skill-sample.json` file.
4. Go back to the Assistants screen and click the menu (with the three dots), and click "Settings."
5. Click "API Details" in the left sidebar.
6. Copy the "Assistant ID" and paste it into your `config.js` file

Run!

    sudo node conversation.js

> Note the `sudo` command. Root user access is required to run TJBot recipes.

Watson conversation uses intents to label the purpose of a sentence. For example when you ask TJBot "Please introduce yourself", the intent is to make an introduction. You can add your own new intents, but for now, we have started you off with a few intents:

- Introduction. You can say phrases such as "Watson, please introduce yourself", "Watson, who are you", and "Watson, can you introduce yourself"
- Joke. You can ask "Watson, please tell me a joke" or "Watson, I would like to hear a joke".

For a complete list, check the content of workspace-sample.json

An **attention word** is used so TJBot knows you are talking to it. The default attention word is 'tinker', but you can change it in `config.js` by changing `robotName`:

    export default {
        assistantId: '', // add your assistant id from Watson Assistant
        hasCamera: true, // set this to false if your TJBot doesn't have a camera
        robotName: 'tinker', // set this to the name you wish to use to address your tjbot!
    }

# Watson Services
- [Watson Assistant](https://www.ibm.com/watson/services/conversation/)
- [Text to Speech](https://www.ibm.com/watson/services/text-to-speech/)
- [Speech to Text](https://www.ibm.com/watson/services/speech-to-text/)

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

# Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
