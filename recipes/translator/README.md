# Translator
> Learn another language with TJBot!

This recipe uses the [Language Translator](https://www.ibm.com/watson/services/language-translator), [Speech to Text](https://www.ibm.com/watson/services/speech-to-text/), and [Text to Speech](https://www.ibm.com/watson/services/text-to-speech/) services to act as your own personal language translator. Speak in English and TJBot will translate your words to another language!

## Hardware
This recipe requires a TJBot with a microphone and a speaker.

## Build and Run
First, make sure you have configured your Raspberry Pi for TJBot by following the [bootstrap instructions](https://github.com/ibmtjbot/tjbot/tree/master/bootstrap).

Next, go to the `recipes/translator` folder and install the dependencies.

    $ cd tjbot/recipes/translator
    $ npm install

Create instances of the [Language Translator](https://www.ibm.com/watson/services/language-translator), [Speech to Text](https://www.ibm.com/watson/services/speech-to-text/), and [Text to Speech](https://www.ibm.com/watson/services/text-to-speech/) services and download the authentication credentials file for each service. Combine each of these files into a single file named `ibm-credentials.env` and place it in the `tjbot/recipes/translator` folder. See `ibm-credentials.sample.env` for an example.

Run!

    $ sudo node translator.js

> Note the `sudo` command. Root user access is required to run TJBot recipes.

Now, speak into TJBot's microphone to have it translate your words to another language!

## Customize
By default, TJBot will translate your words into Spanish. Try editing the code to make TJBot speak other languages!

> 🎉 Extra Credit: add a special voice command to change the langauge. For example, telling TJBot to "translate to German" should make future translations be to German.

## Troubleshoot
If you are having difficulties in making this recipe work, please see the [troubleshooting guide](../../TROUBLESHOOTING.md).

# Watson Services
- [Language Translator](https://www.ibm.com/watson/services/language-translator)
- [Speech to Text](https://www.ibm.com/watson/services/speech-to-text/)
- [Text to Speech](https://www.ibm.com/watson/services/text-to-speech/)

# License
This project is licensed under Apache 2.0. Full license text is available in [LICENSE](../../LICENSE).

# Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md).
