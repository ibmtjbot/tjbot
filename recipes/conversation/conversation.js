/**
 * Copyright 2016-2020 IBM Corp. All Rights Reserved.
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

import TJBot from 'tjbot';
import {
    assistantId,
    hasCamera
} from './config';

// these are the hardware capabilities that TJ needs for this recipe
const hardware = [TJBot.HARDWARE.MICROPHONE, TJBot.HARDWARE.SPEAKER, TJBot.HARDWARE.LED, TJBot.HARDWARE.SERVO];
if (hasCamera) {
    hardware.append(TJBot.HARDWARE.CAMERA);
}

// set up TJBot's configuration
const config = {
    log: {
        level: 'verbose',
    },
    converse: {
        assistantId,
    },
};

// instantiate our TJBot!
const tj = new TJBot(config);
tj.initialize(hardware);

console.log('You can ask me to introduce myself or tell you a joke.');
console.log(`Try saying, "${tj.configuration.robot.name}, please introduce yourself" or "${tj.configuration.robot.name}, what can you do?"`);
console.log(`You can also say, "${tj.configuration.robot.name}, tell me a joke!`);

// listen for utterances with our attentionWord and send the result to
// the Assistant service
async function handleMessage(msg) {
    // check to see if they are talking to TJBot
    if (msg.toLowerCase().startsWith(tj.configuration.robot.name.toLowerCase())) {
        // remove our name from the message
        // const turn = msg.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), '');
        const utterance = msg.toLowerCase();

        // send to the assistant service
        const response = await tj.converse(utterance);
        let spoken = false;

        // check if an intent to control the bot was found
        if (response.object.intents !== undefined) {
            const intent = response.object.intents[0];
            if (intent !== undefined && intent.intent !== undefined) {
                switch (intent.intent) {
                case 'lower-arm':
                    tj.speak(response.description);
                    tj.lowerArm();
                    spoken = true;
                    break;
                case 'raise-arm':
                    tj.speak(response.description);
                    tj.raiseArm();
                    spoken = true;
                    break;
                case 'wave':
                    tj.speak(response.description);
                    tj.wave();
                    spoken = true;
                    break;
                case 'greeting':
                    tj.speak(response.description);
                    tj.wave();
                    spoken = true;
                    break;
                case 'shine':
                    {
                        let misunderstood = false;
                        if (response.object.entities !== undefined) {
                            const entity = response.object.entities[0];
                            if (entity !== undefined && entity.value !== undefined) {
                                const color = entity.value;
                                tj.speak(response.description);
                                tj.shine(color);
                                spoken = true;
                            } else {
                                misunderstood = true;
                            }
                        } else {
                            misunderstood = true;
                        }

                        if (misunderstood === true) {
                            tj.speak("I'm sorry, I didn't understand your color");
                            spoken = true;
                        }
                    }
                    break;
                case 'see':
                    if (hasCamera === false) {
                        tj.speak("I'm sorry, I don't have a camera so I can't see anything");
                        spoken = true;
                    } else {
                        tj.speak(response.description);
                        const objects = await tj.see();

                        if (objects.length === 0) {
                            tj.speak("I'm not sure I see anything");
                        } else if (objects.length === 1) {
                            tj.speak(`I see ${objects[0].class}`);
                        } else if (objects.length === 2) {
                            tj.speak(`I'm looking at ${objects[0].class} and ${objects[1].class}`);
                        } else {
                            tj.speak(`I'm looking at ${objects[0].class}, ${objects[1].class}, ${objects[2].class}, and a few other things too`);
                        }
                        spoken = true;
                    }
                    break;
                default:
                    break;
                }
            }
        }

        // if we didn't speak a response yet, speak it now
        if (spoken === false) {
            tj.speak(response.description);
        }
    }
}

tj.listen(handleMessage);
