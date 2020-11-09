/* eslint-disable import/extensions */
/**
 * Copyright 2016-2020 IBM Corp. All Rights Reserved.
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

import TJBot from 'tjbot';
import Twitter from 'twitter';
import config from './config.js';

// covert sec to msec
const sentimentAnalysisFrequencyMsec = config.sentimentAnalysisFrequencySec * 1000;

// these are the hardware capabilities that TJ needs for this recipe
const hardware = [TJBot.HARDWARE.LED_NEOPIXEL];

// set up TJBot's configuration
const tjConfig = {
    log: {
        level: 'info', // change to 'verbose' or 'silly' for more detail about what TJBot is doing
    },
};

// uncomment to change the pins for the LED
// tjConfig.shine = {
//     neopixel: {
//         gpioPin: 18
//     },
//     commonAnode: {
//         redPin: 19,
//         greenPin: 13,
//         bluePin: 12
//     }
// };

// instantiate our TJBot!
const tj = new TJBot(tjConfig);
tj.initialize(hardware);

// create the twitter client
const twitter = new Twitter({
    consumer_key: config.twitterCredentials.consumerKey,
    consumer_secret: config.twitterCredentials.consumerSecret,
    access_token_key: config.twitterCredentials.accessTokenKey,
    access_token_secret: config.twitterCredentials.accessTokenSecret,
});

console.log(`I am monitoring twitter for ${config.sentimentKeyword}. It may take a few moments to collect enough tweets to analyze.`);

// turn the LED off
tj.shine('off');

// collect tweets
const TWEETS = [];
const MAX_TWEETS = 100;
const CONFIDENCE_THRESHOLD = 0.5;

function shineForEmotion(emotion) {
    console.log(`Current emotion around ${config.sentimentKeyword} is ${emotion}`);

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

async function shineFromTweetSentiment() {
    // make sure we have at least 5 tweets to analyze, otherwise it
    // is probably not enough.
    if (TWEETS.length > 5) {
        const text = TWEETS.join(' ');
        console.log(`Analyzing tone of ${TWEETS.length} tweets`);

        const tone = await tj.analyzeTone(text);

        // find the tone with the highest confidence
        // only consider the emotional tones (anger, fear, joy, sadness)
        // each tone looks like this:
        // {
        //   "score": 0.6165,
        //   "tone_id": "sadness",
        //   "tone_name": "Sadness"
        // }
        const emotionalTones = tone.document_tone.tones.filter((t) => t.tone_id === 'anger' || t.tone_id === 'fear' || t.tone_id === 'joy' || t.tone_i === 'sadness');

        if (emotionalTones.length > 0) {
            const maxTone = emotionalTones.reduce((a, b) => ((a.score > b.score) ? a : b));

            // make sure we really are confident
            if (maxTone.score >= CONFIDENCE_THRESHOLD) {
                shineForEmotion(maxTone.tone_id);
            }
        }
    } else {
        console.log('Not enough tweets collected to perform sentiment analysis');
    }
}

function monitorTwitter() {
    // monitor twitter
    twitter.stream('statuses/filter', {
        track: config.sentimentKeyword,
    }, (stream) => {
        stream.on('data', (event) => {
            if (event && event.text) {
                let tweet = event.text;

                // Remove non-ascii characters (e.g chinese, japanese, arabic, etc.) and
                // remove hyperlinks
                // eslint-disable-next-line no-control-regex
                tweet = tweet.replace(/[^\x00-\x7F]/g, '');
                tweet = tweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

                // keep a buffer of MAX_TWEETS tweets for sentiment analysis
                while (TWEETS.length >= MAX_TWEETS) {
                    TWEETS.shift();
                }
                TWEETS.push(tweet);
            }
        });

        stream.on('error', (error) => {
            console.log('\nAn error has occurred while connecting to Twitter. Please check your twitter credentials, and also refer to https://dev.twitter.com/overview/api/response-codes for more information on Twitter error codes.\n');
            throw error;
        });
    });

    // perform sentiment analysis every N seconds
    setInterval(() => {
        console.log('Performing sentiment analysis of the tweets');
        shineFromTweetSentiment();
    }, sentimentAnalysisFrequencyMsec);
}

// begin monitoring twitter
monitorTwitter();
