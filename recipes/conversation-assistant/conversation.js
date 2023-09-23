/* eslint-disable import/extensions */
/**
 * Copyright 2016-2023 IBM Corp. All Rights Reserved.
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
import config from './config.js';

// these are the hardware capabilities that TJ needs for this recipe
const hardware = [TJBot.HARDWARE.MICROPHONE, TJBot.HARDWARE.SPEAKER, TJBot.HARDWARE.LED_NEOPIXEL, TJBot.HARDWARE.SERVO];

// set up TJBot's configuration
const tjConfig = {
    log: {
        level: 'info', // change to 'verbose' or 'silly' for more detail about what TJBot is doing
    },
    converse: {
        assistantId: config.assistantId,
    }
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

// uncomment to change the pin for the servo
// tjConfig.wave = {
//     servoPin: 7
// };

// instantiate our TJBot!
const tj = new TJBot(tjConfig);
tj.initialize(hardware);

console.log('You can ask me to introduce myself or tell you a joke.');
console.log(`Try saying, "${config.robotName}, please introduce yourself" or "${config.robotName}, what can you do?"`);
console.log(`You can also say, "${config.robotName}, tell me a joke!"`);
console.log("Say 'stop' or press ctrl-c to exit this recipe.");

// listen for utterances with our attentionWord and send the result to
// the Assistant service
while (true) {
    const msg = await tj.listen();

    if (msg === 'stop') {
        console.log('Goodbye!');
        process.exit(0);
    }

    // check to see if they are talking to TJBot
    if (msg.toLowerCase().startsWith(config.robotName.toLowerCase())) {
        // remove our name from the message
        const utterance = msg.toLowerCase().replace(config.robotName.toLowerCase(), '').substr(1);
        // const utterance = msg.toLowerCase();

        // send to the assistant service
        const response = await tj.converse(utterance);
        let spoken = false;

        // check if an intent to control the bot was found
        if (response.object.intents !== undefined) {
            console.log(`found intent(s): ${JSON.stringify(response.object.intents)}`);

            // choose the most confident intent
            const intent = response.object.intents.reduce((max, i) => {
                return (i.confidence > max.confidence) ? i : max;
            }, {intent: '', confidence: 0.0});

            console.log(`selecting intent with maximum confidence: ${JSON.stringify(intent)}`);
            switch (intent.intent) {
            case 'lower-arm':
                await tj.speak(response.description);
                tj.lowerArm();
                spoken = true;
                break;
            case 'raise-arm':
                await tj.speak(response.description);
                tj.raiseArm();
                spoken = true;
                break;
            case 'wave':
                await tj.speak(response.description);
                tj.wave();
                spoken = true;
                break;
            case 'greeting':
                await tj.speak(response.description);
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
                            await tj.speak(response.description);
                            tj.shine(color);
                            spoken = true;
                        } else {
                            misunderstood = true;
                        }
                    } else {
                        misunderstood = true;
                    }

                    if (misunderstood === true) {
                        await tj.speak("I'm sorry, I didn't understand your color");
                        spoken = true;
                    }
                }
                break;
            default:
                break;
            }
        }

        // if we didn't speak a response yet, speak it now
        if (spoken === false) {
            await tj.speak(response.description);
        }
    }
}
