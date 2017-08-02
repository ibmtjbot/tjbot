/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var TJBot = require('tjbot');
var config = require('./config');

// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
var WORKSPACEID = config.conversationWorkspaceId;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['microphone', 'speaker']; //full capabilities list ['led', 'servo', 'microphone', 'speaker','camera']

// set up TJBot's configuration
var tjConfig = {
    log: {
        level: 'verbose'
    }
};

/*
//Other configuration parameters you can set include
var tjConfig = {
    log: {
        level: 'info' // valid levels are 'error', 'warn', 'info', 'verbose', 'debug', 'silly'
    },
    robot: {
        gender: 'male', // see TJBot.prototype.genders
        name: 'Watson'
    },
    listen: {
        microphoneDeviceId: "plughw:1,0", // plugged-in USB card 1, device 0; see arecord -l for a list of recording devices
        inactivityTimeout: -1, // -1 to never timeout or break the connection. Set this to a value in seconds e.g 120 to end connection after 120 seconds of silence
        language: 'en-US' // see TJBot.prototype.languages.listen
    },
    wave: {
        servoPin: 7 // corresponds to BCM 7 / physical PIN 26
    },
    speak: {
        language: 'en-US', // see TJBot.prototype.languages.speak
        voice: undefined, // use a specific voice; if undefined, a voice is chosen based on robot.gender and speak.language
        speakerDeviceId: "plughw:0,0" // plugged-in USB card 1, device 0; see aplay -l for a list of playback devices
    },
    see: {
        confidenceThreshold: {
            object: 0.5,   // only list image tags with confidence > 0.5
            text: 0.1     // only list text tags with confidence > 0.5
        },
        camera: {
            height: 720,
            width: 960,
            verticalFlip: false, // flips the image vertically, may need to set to 'true' if the camera is installed upside-down
            horizontalFlip: false // flips the image horizontally, should not need to be overridden
        }
    }
};
 */

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

console.log("You can ask me to introduce myself or tell you a joke.");
console.log("Try saying, \"" + tj.configuration.robot.name + ", please introduce yourself\" or \"" + tj.configuration.robot.name + ", who are you?\"");
console.log("You can also say, \"" + tj.configuration.robot.name + ", tell me a joke!\"");

// listen for utterances with our attentionWord and send the result to
// the Conversation service
tj.listen(function(msg) {

    // check to see if they are talking to TJBot
    if (msg.toLowerCase().startsWith(tj.configuration.robot.name.toLowerCase())) {
        // remove our name from the message
        var turn = msg.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), "");

        // send to the conversation service
        tj.converse(WORKSPACEID, turn, function(response) {
            // speak the result
            tj.speak(response.description);
        });
    }
});
