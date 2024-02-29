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
import AssistantV2 from 'ibm-watson/assistant/v2.js';

const assistant = new AssistantV2({
    serviceName: 'assistant',
    version: '2023-06-15',
});

// these are the hardware capabilities that TJ needs for this recipe
// const hardware = [TJBot.HARDWARE.MICROPHONE, TJBot.HARDWARE.SPEAKER, TJBot.HARDWARE.LED_NEOPIXEL, TJBot.HARDWARE.SERVO];
const hardware = [TJBot.HARDWARE.MICROPHONE, TJBot.HARDWARE.SPEAKER]

let assistantSessionId;

// set up TJBot's configuration
const tjConfig = {
    log: {
        level: 'info', // change to 'verbose' or 'silly' for more detail about what TJBot is doing
    },
    converse: {
        assistantId: config.environmentId,
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

async function converse(message) {

    // set up the session if needed
    if (!assistantSessionId) {
        console.log("no session id detected");
        try {
            console.log(`creating assistant session, sessionId: ${config.environmentId}`);
            const body = await assistant.createSession({
                assistantId: config.environmentId,
            });
            console.log(`response from _assistant.createSession(): ${body.result}`);
            assistantSessionId = body.result.session_id;
        } catch (err) {
            console.error(`error creating session for Assistant service. please check that tj.configuration.converse.environmentId is defined.`);
            throw err;
        }
    }

    // define the conversational turn
    const turn = {
        assistantId: config.environmentId,
        sessionId: assistantSessionId,
        input: {
            'message_type': 'text',
            'text': message,
            'options': {
                'return_context': true
            }
        }
    }

    // send to Assistant service
    try {
        const body = await assistant.message(turn);
        console.log(`response from _assistant.message(): ${JSON.stringify(body)}`);
        const { result } = body;

        // this might not be necessary but in the past, conversational replies
        // came in through result.output.text, not result.output.generic
        let response;
        if (result.output.generic) {
            response = result.output.generic;
        } else if (result.output.text) {
            response = result.output.text;
        }

        const responseText = response.length > 0 ? response[0].text : '';
        const assistantResponse = {
            object: result.output,
            description: responseText,
            action: result.context.skills['actions skill'].skill_variables.tj_action
        };
        console.log(`received response from assistant: ${JSON.stringify(responseText)}`);
        return assistantResponse;
    } catch (err) {
        console.error(`Assistant service returned an error.`, err);
        throw err;
    }
}

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

    // send to the assistant service
    const response = await converse(utterance);
    let spoken = false;

    // check if a variable to control the bot was found
    if (response.action !== undefined) {
        console.log(`found action: ${response.action}`);
        switch (response.action) {
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

                    // colors to detect from the user utterance
                    const regex = /(aqua|red|green|white|blue|orange|yellow|violet|pink|on|off)/g;

                    if (utterance.match(regex)) {
                        const color = utterance.match(regex)[0];
                        console.log("Color found! ", color);
                        await tj.speak(response.description);
                        tj.shine(color);
                        spoken = true;
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
        tj.speak(response.description);
    }
}
}