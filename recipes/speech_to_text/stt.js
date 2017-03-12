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

var RED_PIN = 11, GREEN_PIN = 13, BLUE_PIN = 15;
var intervalID = null;
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
    var containsRainbow = str.indexOf("rainbow") >= 0;

    if ((containsTurn || containsChange || containsSet ) && containsLight) {
        if (intervalID) clearInterval(intervalID);
        setLED(str);
    } else if (containsDisco || containsRainbow) {
        intervalID = discoParty();
    }
}

/*********************************************************************
 * Step #5: Switching the LED light
 *********************************************************************
 Once the command is recognized, the led light gets changed to reflect that.
*/

var rpio = require('rpio');

var colorPalette = {
    "red": [0,1,1],
    "read": [0,1,1], // sometimes, STT hears "read" instead of "red"
    "green": [1,0,1],
    "blue": [1,1,0],
    "purple": [0,1,0],
    "yellow": [0,0,1],
    "pink": [0,1,0],
    "orange": [0,1,0],
    "aqua": [0,0,0],
    "white": [0,0,0],
    "off": [1,1,1],
    "on": [0,0,0]
}

/*Initialize the pins*/
var initPins = function(){
  //Pins: 11,13,15
  rpio.open(RED_PIN,rpio.OUTPUT, rpio.HIGH);
  rpio.open(GREEN_PIN,rpio.OUTPUT, rpio.HIGH);
  rpio.open(BLUE_PIN,rpio.OUTPUT, rpio.HIGH);
}

var rpioVal = {
  1 : rpio.HIGH,
  0 : rpio.LOW
}

var turnLight = function (colorConfig){
  initPins();
  rpio.open(RED_PIN,rpio.OUTPUT, rpioVal[colorConfig[0]]);
  rpio.open(GREEN_PIN,rpio.OUTPUT, rpioVal[colorConfig[1]]);
  rpio.open(BLUE_PIN,rpio.OUTPUT, rpioVal[colorConfig[2]]);

}
// ----  reset LED before exit
process.on('SIGINT', function () {
    initPins();
    process.nextTick(function () { process.exit(0); });
});

function setLED(msg){
    var words = msg.split(" ");
    var color = [0,0,0]; //red
/*
    for (var i = 0; i < words.length; i++){
      if (['red','green','blue'].indexOf(words[i]) > -1){
        color = words[i];
        break;
      }
    }*/
   for(var i=0; i < words.length; i++){
     if (words[i] in colorPalette){
       color = colorPalette[words[i]];
     }
   }
    turnLight(color);
    console.log('color = ', color);
}

var discoParty = function () {
      var colors = ['red','green','blue','pink','purple','yellow'];
      return setInterval(function(){
        var rand = colors[Math.floor(Math.random()*colors.length)];
        turnLight(colorPalette[rand]);
      },400);

}
