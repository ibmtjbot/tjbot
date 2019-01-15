/**
 * Copyright 2016-2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *            http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var TJBot = require('tjbot');
var config = require('./config');
var Twitter = require('twitter');

// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
var SENTIMENT_KEYWORD = config.sentiment_keyword;
var SENTIMENT_ANALYSIS_FREQUENCY_MSEC = config.sentiment_analysis_frequency_sec * 1000;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['led'];

// set up TJBot's configuration
var tjConfig = {
    log: {
        level: 'verbose'
    }
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// create the twitter client
var twitter = new Twitter({
    consumer_key: credentials.twitter.consumer_key,
    consumer_secret: credentials.twitter.consumer_secret,
    access_token_key: credentials.twitter.access_token_key,
    access_token_secret: credentials.twitter.access_token_secret
});

console.log("I am monitoring twitter for " + SENTIMENT_KEYWORD + ". It may take a few moments to collect enough tweets to analyze.");

// turn the LED off
tj.shine('off');

monitorTwitter();

// ---

var TWEETS = [];
var MAX_TWEETS = 100;
var CONFIDENCE_THRESHOLD = 0.5;

function monitorTwitter() {
    // monitor twitter
    twitter.stream('statuses/filter', {
        track: SENTIMENT_KEYWORD
    }, function(stream) {
        stream.on('data', function(event) {
            if (event && event.text) {
                var tweet = event.text;

                // Remove non-ascii characters (e.g chinese, japanese, arabic, etc.) and
                // remove hyperlinks
                tweet = tweet.replace(/[^\x00-\x7F]/g, "");
                tweet = tweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");

                // keep a buffer of MAX_TWEETS tweets for sentiment analysis
                while (TWEETS.length >= MAX_TWEETS) {
                    TWEETS.shift();
                }
                TWEETS.push(tweet);
            }
        });

        stream.on('error', function(error) {
            console.log("\nAn error has occurred while connecting to Twitter. Please check your twitter credentials, and also refer to https://dev.twitter.com/overview/api/response-codes for more information on Twitter error codes.\n");
            throw error;
        });
    });

    // perform sentiment analysis every N seconds
    setInterval(function() {
        console.log("Performing sentiment analysis of the tweets");
        shineFromTweetSentiment();
    }, SENTIMENT_ANALYSIS_FREQUENCY_MSEC);
}

function shineFromTweetSentiment() {
    // make sure we have at least 5 tweets to analyze, otherwise it
    // is probably not enough.
    if (TWEETS.length > 5) {
        var text = TWEETS.join(' ');
        console.log("Analyzing tone of " + TWEETS.length + " tweets");

        tj.analyzeTone(text).then(function(tone) {
            // find the tone with the highest confidence
            // only consider the emotional tones (anger, fear, joy, sadness)
            // each tone looks like this:
            // {
            //   "score": 0.6165,
            //   "tone_id": "sadness",
            //   "tone_name": "Sadness"
            // }
            
            var emotionalTones = tone.document_tone.tones.filter(function(t) {
                return t.tone_id == 'anger' || t.tone_id == 'fear' || t.tone_id == 'joy' || t.tone_i == 'sadness';
            });

            if (emotionalTones.length > 0) {
                var maxTone = emotionalTones.reduce(function(a, b) {
                    return (a.score > b.score) ? a : b;
                });

                // make sure we really are confident
                if (maxTone.score >= CONFIDENCE_THRESHOLD) {
                    shineForEmotion(maxTone.tone_id);
                }
            }
        });
    } else {
        console.log("Not enough tweets collected to perform sentiment analysis");
    }
}

function shineForEmotion(emotion) {
    console.log("Current emotion around " + SENTIMENT_KEYWORD + " is " + emotion);

    switch (emotion) {
    case 'anger':
        tj.shine('red');
        break;
    case 'fear':
        tj.shine('magenta');
        break;
    case 'joy':
        tj.shine('yellow');
        break;
    case 'sadness':
        tj.shine('blue');
        break;
    default:
        break;
    }
}
