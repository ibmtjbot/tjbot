# Simon Says
> Play Simon Says with TJBot!

This recipe uses the [watsonx Assistant](https://www.ibm.com/products/watsonx-assistant), [Speech to Text](https://www.ibm.com/products/speech-to-text), and [Text to Speech](https://www.ibm.com/products/text-to-speech/) services to turn TJ into a chatting robot.

## Hardware
This recipe requires a TJBot with a microphone, a speaker, an LED, and a servo.

> 💡 If you have a Common Anode LED, change `TJBot.Hardware.LED_NEOPIXEL` to `TJBot.Hardware.LED_COMMON_ANODE` in `conversation.js`

> 📌 By default, TJBot expects Neopixel LEDs to be connected to GPIO PIN 18 and Common Anode LEDs to be connected to GPIO pins 19 (red), 13 (green), and 12 (blue). You may set which pins your LED is connected to by uncommenting the `tjConfig.shine = {...}` code block. See [https://pinout.xyz](https://pinout.xyz) for a complete pin diagram.

> 👋 By default, TJBot expects the servo to be connected to GPIO PIN 7. You may set which pin your servo is connected to by uncommenting the `tjConfig.wave = {...}` code block. See [https://pinout.xyz](https://pinout.xyz) for a complete pin diagram.

## Build and Run
First, make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

Next, go to the `recipes/conversation_watsonxassistant` folder and install the dependencies.

    $ cd tjbot/recipes/conversation_watsonxassistant
    $ npm install

### Create instances of IBM Cloud AI services
Create instances of the [watsonx Assistant](https://cloud.ibm.com/catalog/services/watsonx-assistant), [Speech to Text](https://cloud.ibm.com/catalog/services/speech-to-text), and [Text to Speech](https://cloud.ibm.com/catalog/services/text-to-speech) services. Download the authentication credentials file for each service. Combine each of these files into a single file named `ibm-credentials.env` and place it in the `tjbot/recipes/translator` folder. See `ibm-credentials.sample.env` for an example.

Next, make a copy of TJBot's sample configuration file.

```sh
$ cp tjbot.sample.toml tjbot.toml
$ nano tjbot.toml
```

Set up Watson Assistant using the following steps:

1. Launch the Watson Assistant tool and create a new assistant.
2. Click "Add dialog skill" and then "Import Skill."
3. Upload the `tjbot-action-sample.json` file.
4. Go back to the Assistants screen and click the menu (with the three dots), and click "Settings."
5. Click "API Details" in the left sidebar.
6. Copy the "Assistant ID".

In the `[Recipe]` section of your `tjbot.toml` file, fill in the `environmentId` configuration parameter with the Assistant ID you just retrieved.

Run!

    $ sudo npm start

> Note the `sudo` command. Root user access is required to run TJBot recipes.

watsonx Assistant uses actions to route the flow of a conversation. For example when you ask TJBot "Please introduce yourself", the action is to make an introduction. You can add your own new actions, but for now, we have started you off with a few actions:

- Introduction. You can say phrases such as "Tinker, please introduce yourself", "Tinker, who are you", and "Tinker, can you introduce yourself"
- Joke. You can ask "Tinker, please tell me a joke" or "Tinker, I would like to hear a joke".
- Raise your arm. You can ask "Tinker, raise your arm" or "Tinker, lift your arm".

To see the entire list, explore the watsonx Assistant actions tab in the IBM Cloud UI.

An **attention word** is used so TJBot knows you are talking to it. The default attention word is 'tinker', but you can change it in `tjbot.toml` by changing `robotName`:

    export default {
        assistantId: '', // add your assistant id from Watson Assistant
        hasCamera: true, // set this to false if your TJBot doesn't have a camera
        robotName: 'tinker', // set this to the name you wish to use to address your tjbot!
    }

## Troubleshoot
If you are having difficulties in making this recipe work, please see the [troubleshooting guide](../../TROUBLESHOOTING.md).

# Watson Services
- [watsonx Assistant](https://www.ibm.com/products/watsonx-assistant)
- [Text to Speech](https://www.ibm.com/products/text-to-speech/)
- [Speech to Text](https://www.ibm.com/products/speech-to-text)

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

# Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).