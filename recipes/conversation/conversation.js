/**
 * Copyright 2016-2018 IBM Corp. All Rights Reserved.
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
var WORKSPACEID = config.workspaceId;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['microphone', 'speaker', 'led', 'servo', 'camera'];
if (config.hasCamera == false) {
    hardware = ['microphone', 'speaker', 'led', 'servo'];
}

// obtain TJBot's configuration from config.js
var tjConfig = config.tjConfig;

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

console.log("You can ask me to introduce myself or tell you a joke.");
console.log("Try saying, \"" + tj.configuration.robot.name + ", please introduce yourself\" or \"" + tj.configuration.robot.name + ", what can you do?\"");
console.log("You can also say, \"" + tj.configuration.robot.name + ", tell me a joke!\"");

// listen for utterances with our attentionWord and send the result to
// the Assistant service
tj.listen(function(msg) {
    // check to see if they are talking to TJBot
    if (msg.toLowerCase().startsWith(tj.configuration.robot.name.toLowerCase())) {
        // remove our name from the message
        var turn = msg.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), "");
        
        var utterance = msg.toLowerCase();
        
        // send to the assistant service
        tj.converse(WORKSPACEID, utterance, function(response) {
            var spoken = false;
            
            // check if an intent to control the bot was found
            if (response.object.intents != undefined) {
                var intent = response.object.intents[0];
                if (intent != undefined && intent.intent != undefined) {
                    switch (intent.intent) {
                        case "lower-arm":
                            tj.speak(response.description);
                            tj.lowerArm();
                            spoken = true;
                            break;
                        case "raise-arm":
                            tj.speak(response.description);
                            tj.raiseArm();
                            spoken = true;
                            break;
                        case "wave":
                            tj.speak(response.description);
                            tj.wave();
                            spoken = true;
                            break;
                        case "greeting":
                            tj.speak(response.description);
                            tj.wave();
                            spoken = true;
                            break;
                        case "shine":
                            var misunderstood = false;
                            if (response.object.entities != undefined) {
                                var entity = response.object.entities[0];
                                if (entity != undefined && entity.value != undefined) {
                                    var color = entity.value;
                                    tj.speak(response.description);
                                    tj.shine(color);
                                    spoken = true;
                                } else {
                                    misunderstood = true;
                                }
                            } else {
                                misunderstood = true;
                            }
                            
                            if (misunderstood == true) {
                                tj.speak("I'm sorry, I didn't understand your color");
                                spoken = true;
                            }
                            break;
                        case "see":
                            if (config.hasCamera == false) {
                                tj.speak("I'm sorry, I don't have a camera so I can't see anything");
                                spoken = true;
                            } else {
                                tj.speak(response.description);
                                tj.see().then(function(objects) {
                                    if (objects.length == 0) {
                                        tj.speak("I'm not sure I see anything");
                                    } else if (objects.length == 1) {
                                        var object = objects[0].class;
                                        tj.speak("I see " + object);
                                    } else if (objects.length == 2) {
                                        var objects = objects[0].class + " and " + objects[1].class;
                                        tj.speak("I'm looking at " + objects);
                                    } else {
                                        var objects = objects[0].class + ", " + objects[1].class + ", and " + objects[2].class + ", and a few other things too";
                                        tj.speak("I'm looking at " + objects);
                                    }
                                });
                                spoken = true;
                            }
                            break;
                        }
                    }
                }
            
                // if we didn't speak a response yet, speak it now
                if (spoken == false) {
                    tj.speak(response.description);
                }
        });
    }
});
