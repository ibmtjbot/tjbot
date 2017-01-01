/************************************************************************
* Copyright 2016 IBM Corp. All Rights Reserved.
*
* Watson Maker Kits
* 
* This project is licensed under the Apache License 2.0, see LICENSE.* 
*
************************************************************************
*
* Control a NeoPixel LED unit connected to a Raspberry Pi pin by analyzing Twitter data using Watson Tone Analyzer
* Must run with root-level protection
* Sudo node sentiment.js

Based on ws281x library created by Jeremy Garff (jer@jers.net)

Follow the instructions in http://www.instructables.com/id/Make-Your-Robot-Respond-to-Emotions-Using-Watson/ to
get the system ready to run this code.
*/

/************************************************************************
* Step #1: Configuring your Twitter Credentials
************************************************************************
In this step, we set up our Twitter credentials and parameters (keywords) and the
fetch  tweets related to the keyword as text. Each tweet is added to a tweet buffer as it arrives
*/
var config = require("./config") ; // Gets your username and passwords from the config.js file
var Twitter = require('twitter');
var maxtweets = 20 ;
var confidencethreshold = 0.5 ; // The program only responds to the sentiments that are retrieved with a confidence level stronger than this given threshold. You may change the threshold as needed.
var tweetbuffer = [] ;
var searchkeyword = config.searchkeyword;    // keyword to use in twitter search
var searchparams = {q: searchkeyword, count: maxtweets};
var sentimentinterval = 3000 ; // calculate sentiment every 3 seconds.

var twitterclient = new Twitter({ //Retrieving your Twitter credentials
  consumer_key: config.twittercredentials.consumer_key,
  consumer_secret: config.twittercredentials.consumer_secret,
  access_token_key: config.twittercredentials.access_token_key,
  access_token_secret:  config.twittercredentials.access_token_secret
});

fetchTweets(searchparams)
function fetchTweets(searchparams){
  var alltweets = "";
  console.log("Fetching tweets for keyword " + searchkeyword + ". This may take some time.");
  twitterclient.stream('statuses/filter', {track: searchkeyword }, function(stream) {
    stream.on('data', function(event) {
      if(event && event.text){
        var tweet = event.text ;
        tweet = tweet.replace(/[^\x00-\x7F]/g, "") // Remove non-ascii characters e.g chinese, japanese, arabic letters etc
        tweet = tweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ""); // Remove link
        if(tweetbuffer.length == maxtweets){ // if we have enough tweets, remove one
          tweetbuffer.shift() ;
        }
        tweetbuffer.push(tweet)

      }
    });

    stream.on('error', function(error) {
      console.log("\nAn error has occurred while connecting to Twitter. Please check your twitter credentials, and also refer to https://dev.twitter.com/overview/api/response-codes for more on twitter error codes. \n")
      throw error;
    });
  });
}
SampleTweetBuffer();
function SampleTweetBuffer(){
  setInterval(function() {
    if (tweetbuffer.length > 0){
      //console.log("sampling .. " + tweetbuffer.length);
      analyzeTone(); // Analyze the tone of tweets if we have more than one tweet
    }

  }, sentimentinterval);
}


/************************************************************************
* Step #2: Analyze the tone of the Tweets
************************************************************************
In this step, the program uses Watson Tone Analyzer to analyze the emotions that are retrieved from the tweetbuffer.
The IBM Watson™ Tone Analyzer Service uses linguistic analysis to detect three types of tones from text: emotion, social tendencies, and language style.
Emotions identified include things like anger, fear, joy, sadness, and disgust.
*/
var watson = require('watson-developer-cloud');
function analyzeTone(){
  var text = "";
  tweetbuffer.forEach(function(tweet){
    text = text + " " + tweet ;  // Combine all texts in the tweetbuffer array into a single text.
  })
  //console.log(text + "\n ====== ")
  var tone_analyzer = watson.tone_analyzer({ //Retrieving your Bluemix credentials
    username: config.toneanalyzercredentials.username,
    password: config.toneanalyzercredentials.password,
    version: config.toneanalyzercredentials.version,
    version_date: '2016-05-19'
  });
  tone_analyzer.tone({ text: text },
    function(err, tone) {
      if (err) {
        console.log(err);
      }
      else {
        tone.document_tone.tone_categories.forEach(function(tonecategory){
          if(tonecategory.category_id == "emotion_tone"){
            //console.log(tonecategory.tones)
            tonecategory.tones.forEach(function(emotion){
              if(emotion.score >= confidencethreshold) { // pulse only if the likelihood of an emotion is above the given confidencethreshold
                processEmotion(emotion)
              }
            })
          }
        })
      }
    });
  }

  /*********************************************************************************************
  * Step #3: Change the color of the LED based on the sentiments of the retrieve tweets
  **********************************************************************************************
  In this step, the program determines the color of the LED based on the analyzed emotion.
  Different colors are associated to different emotions. You can customize your own color!
  Anger = Red
  Joy = Yellow
  Fear = Purple etc
  */

  var ws281x = require('rpi-ws281x-native');
  var NUM_LEDS = 1;
  ws281x.init(NUM_LEDS);
  var color = new Uint32Array(NUM_LEDS);

  // ----  reset LED before exit
  process.on('SIGINT', function () {
    ws281x.reset();
    process.nextTick(function () { process.exit(0); });
  });

  var red = 0x00ff00 ;
  var green = 0xff0000 ;
  var blue = 0x0000ff ;
  var yellow = 0xffff00 ;
  var purple = 0x00ffff ;

  // Process emotion returned from Tone Analyzer Above
  // Show a specific color fore each emotion
  function processEmotion(emotion){
    console.log("Current Emotion Around " + searchkeyword + " is ", emotion.tone_id);
    if (emotion.tone_id == "anger"){
      setLED(red);
    }else if(emotion.tone_id == "joy"){
      setLED(yellow);
    }else if(emotion.tone_id == "fear"){
      setLED(purple);
    }else if(emotion.tone_id == "disgust"){
      setLED(green);
    }else if(emotion.tone_id == "sadness"){
      setLED(blue);
    }
  }

  // Set the LED to the given color value
  function setLED(colorval){
    color[0] = colorval ;
    ws281x.render(color);
  }
