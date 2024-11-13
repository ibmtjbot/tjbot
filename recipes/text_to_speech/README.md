# Text to Speech
> :robot: :microphone: Build a talking robot with Text to Speech!

This recipe uses the [Text to Speech](https://www.ibm.com/products/text-to-speech) service to give TJBot a voice.

## Hardware
This recipe requires a TJBot with a speaker.

## Build and Run
First, make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

Next, go to the `recipes/text_to_speech` folder and install the dependencies.

    $ cd tjbot/recipes/text_to_speech
    $ npm install

Create an instance of the [Text to Speech](https://www.ibm.com/products/text-to-speech) service and download the authentication credentials file. Ensure this file is named `ibm-credentials.env` and place it in the `tjbot/recipes/text_to_speech` folder.

Run!

    $ sudo npm start

> Note the `sudo` command. Root user access is required to run TJBot recipes.

Now, type into the terminal what you would like TJBot to say.

## Troubleshoot
If you are having difficulties in making this recipe work, please see the [troubleshooting guide](../../TROUBLESHOOTING.md).

# Watson Services
- [Text to Speech](https://www.ibm.com/products/text-to-speech)

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

# Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
