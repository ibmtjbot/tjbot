
var RED_PIN = 11, GREEN_PIN = 13, BLUE_PIN = 15;
var LIGHT_PIN = 40;
var rpio = require('rpio');
var intervalIDs = [], intervalID = null;
var watson = require('watson-developer-cloud');
var config = require('./config');  // gets our username and passwords from the config.js files
var speech_to_text = watson.speech_to_text({
    username: config.username,
    password: config.password,
    version: config.version
});



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


var recognizeparams = {
  content_type: 'audio/l16; rate=44100; channels=2',
  model: 'en-US_BroadbandModel'  // Specify your language model here
};
var textStream = micInputStream.pipe(
    speech_to_text.createRecognizeStream(recognizeparams)
);



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
        stopParty();
        setLED(str);
    } else if (containsDisco || containsRainbow) {
        intervalID = discoParty();
        intervalIDs.push(intervalID);
    }
}

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
  rpio.write(RED_PIN,rpioVal[colorConfig[0]]);
  rpio.write(GREEN_PIN,rpioVal[colorConfig[1]]);
  rpio.write(BLUE_PIN,rpioVal[colorConfig[2]]);

}

var switchLight = function(command){
  rpio.open(LIGHT_PIN,rpio.OUTPUT,rpio.LOW);
  switch (command) {
    case 'on':
      console.log('vao on');
      rpio.write(LIGHT_PIN,rpio.HIGH);
      break;
    case 'off':
      rpio.write(LIGHT_PIN,rpio.LOW);
      break;
    default:
      rpio.write(LIGHT_PIN,rpio.LOW);
  }
}
// ----  reset LED before exit
process.on('SIGINT', function () {
    initPins();
    process.nextTick(function () { process.exit(0); });
});

function setLED(msg){
    var words = msg.split(" ");
    var color = [0,0,0]; //red

   for(var i=0; i < words.length; i++){
     if (words[i] in colorPalette){
       color = colorPalette[words[i]];
       /*inject code to switch lamp*/
       if (['on','off'].indexOf(words[i]) > -1){
         console.log(words[i]);
         switchLight(words[i]);
       }

     }
   }
    turnLight(color);
    //console.log('color = ', color);
}

var stopParty = function(){
  for (var i = 0; i < intervalIDs.length; i++){
    clearInterval(intervalIDs[i]);
  }
}

var discoParty = function () {
      var colors = ['red','green','blue','pink','purple','yellow'];
      return setInterval(function(){
        var rand = colors[Math.floor(Math.random()*colors.length)];
        turnLight(colorPalette[rand]);
      },400);

}
