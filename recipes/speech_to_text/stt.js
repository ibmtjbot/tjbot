/************************************************************************
* Copyright 2016 IBM Corp. All Rights Reserved.
*
* Watson Maker Kits
*
* This project is licensed under the Apache License 2.0, see LICENSE.*
*
************************************************************************
*
* Control a NeoPixel LED unit connected to a Raspberry Pi pin through voice commands
* Must run with root-level protection
* sudo node stt.js

 Based on example NeoPixel code by Jeremy Garff (jer@jers.net)

 Follow the instructions in http://www.instructables.com/id/Use-Your-Voice-to-Control-a-Light-With-Watson/ to
 get the system ready to run this code.
*/

/************************************************************************
 * Step #1: Configuring your Bluemix Credentials
 ************************************************************************
 In this step, the audio sample (pipe) is sent to "Watson Speech to Text" to transcribe.
 The service converts the audio to text and saves the returned text in "textStream"
*/
var watson = require('watson-developer-cloud');
var config = require('./config');  // gets our username and passwords from the config.js files
var speech_to_text = watson.speech_to_text({
    username: config.username,
    password: config.password,
    version: config.version
});

/************************************************************************
 * Step #2: Configuring the Microphone
 ************************************************************************
 In this step, we configure your microphone to collect the audio samples as you talk.
 See https://www.npmjs.com/package/mic for more information on
 microphone input events e.g on error, startcomplete, pause, stopcomplete etc.
*/

// Initiate Microphone Instance to Get audio samples
var mic = require('mic');
var micInstance = mic({ 'rate': '44100', 'channels': '2', 'debug': false, 'exitOnSilence': 6 });
var micInputStream = micInstance.getAudioStream();

micInputStream.on('data', function(data) {
    //console.log("Recieved Input Stream: " + data.length);
});

micInputStream.on('error', function(err) {
    console.log("Error in Input Stream: " + err);
});

micInputStream.on('silence', function() {
    // detect silence.
});
micInstance.start();
console.log("TJBot is listening, you may speak now.");

/************************************************************************
 * Step #3: Converting your Speech Commands to Text
 ************************************************************************
 In this step, the audio sample is sent (piped) to "Watson Speech to Text" to transcribe.
 The service converts the audio to text and saves the returned text in "textStream".
 You can also set the language model for your speech input.
 The following language models are available
     ar-AR_BroadbandModel
     en-UK_BroadbandModel
     en-UK_NarrowbandModel
     en-US_BroadbandModel (the default)
     en-US_NarrowbandModel
     es-ES_BroadbandModel
     es-ES_NarrowbandModel
     fr-FR_BroadbandModel
     ja-JP_BroadbandModel
     ja-JP_NarrowbandModel
     pt-BR_BroadbandModel
     pt-BR_NarrowbandModel
     zh-CN_BroadbandModel
     zh-CN_NarrowbandModel
*/
var recognizeparams = {
  content_type: 'audio/l16; rate=44100; channels=2',
  model: 'en-US_BroadbandModel'  // Specify your language model here
};
var textStream = micInputStream.pipe(
    speech_to_text.createRecognizeStream(recognizeparams)
);


/*********************************************************************
 * Step #4: Parsing the Text
 *********************************************************************
 In this step, we parse the text to look for commands such as "ON" or "OFF".
 You can say any variations of "lights on", "turn the lights on", "turn on the lights", etc.
 You would be able to create your own customized command, such as "good night" to turn the lights off.
 What you need to do is to go to parseText function and modify the text.
*/

textStream.setEncoding('utf8');
textStream.on('data', function(str) {
    console.log(' ===== Speech to Text ===== : ' + str); // print each text we receive
    parseText(str);
});

textStream.on('error', function(err) {
  console.log(' === Watson Speech to Text : An Error has occurred =====') ; // handle errors
  console.log(err) ;
  console.log("Press <ctrl>+C to exit.") ;
});

function parseText(str){
    var containsTurn = str.indexOf("turn") >= 0;
    var containsChange = str.indexOf("change") >= 0;
    var containsSet = str.indexOf("set") >= 0;
    var containsLight = str.indexOf("the light") >= 0;
    var containsDisco = str.indexOf("disco") >= 0;

    if ((containsTurn || containsChange || containsSet) && containsLight) {
        setLED(str);
    } else if (containsDisco) {
        discoParty();
    }
}

/*********************************************************************
 * Step #5: Switching the LED light
 *********************************************************************
 Once the command is recognized, the led light gets changed to reflect that.
 The npm "onoff" library is used for this purpose. https://github.com/fivdi/onoff
*/

var ws281x = require('rpi-ws281x-native');
var NUM_LEDS = 1;        // Number of LEDs
ws281x.init(NUM_LEDS);   // initialize LEDs

var color = new Uint32Array(NUM_LEDS);  // array that stores colors for leds
color[0] = 0xffffff;                    // default to white

// note that colors are specified as Green-Red-Blue, not Red-Green-Blue
// e.g. 0xGGRRBB instead of 0xRRGGBB
var colorPalette = {
    "red": 0x00ff00,
    "read": 0x00ff00, // sometimes, STT hears "read" instead of "red"
    "green": 0xff0000,
    "blue": 0x0000ff,
    "purple": 0x008080,
    "yellow": 0xc1ff35,
    "magenta": 0x00ffff,
    "orange": 0xa5ff00,
    "aqua": 0xff00ff,
    "white": 0xffffff,
    "off": 0x000000,
    "on": 0xffffff
}

// ----  reset LED before exit
process.on('SIGINT', function () {
    ws281x.reset();
    process.nextTick(function () { process.exit(0); });
});

function setLED(msg){
    var words = msg.split(" ");
    for (var i = 0; i < words.length; i++) {
        if (words[i] in colorPalette) {
            color[0] = colorPalette[words[i]];
            break;
        }
    }
    ws281x.render(color);
}

function discoParty() {
    // uncomment this for a disco party!
    /*for (i = 0; i < 30; i++) {
        setTimeout(function() {
            var colors = Object.keys(colorPalette);
            var randIdx = Math.floor(Math.random() * colors.length);
            var randColor = colors[randIdx];
            setLED(randColor);
        }, i * 250);
    }*/
}
