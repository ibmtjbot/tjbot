# Conversation
> Chat with TJBot!

This recipe uses the [Watson Assistant](https://www.ibm.com/watson/services/conversation/) and [Watson Text to Speech](https://www.ibm.com/watson/services/text-to-speech/) services to turn TJ into a chatting robot.

## Hardware
This recipe requires a TJBot with a microphone and a speaker.

## Build and Run
First, make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

Next, go to the `recipes/conversation` folder and install the dependencies.

    $ cd tjbot/recipes/conversation
    $ npm install

Create instances of the [Watson Assistant](https://www.ibm.com/watson/services/conversation/) and [Watson Text to Speech](https://www.ibm.com/watson/services/text-to-speech/) services and note the authentication credentials.

Import the `workspace-sample.json` file into the Watson Assistant service and note the workspace ID.

Make a copy the default configuration file and update it with the Watson service credentials and the conversation workspace ID.

    $ cp config.default.js config.js
    $ nano config.js
    <enter your credentials and the conversation workspace ID in the specified places>

Run!

    sudo node conversation.js

> Note the `sudo` command. Root user access is required to run TJBot recipes.

# Watson Services
- [Watson Assistant](https://www.ibm.com/watson/services/conversation/)
- [Watson Text to Speech](https://www.ibm.com/watson/services/text-to-speech/)

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

# Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
