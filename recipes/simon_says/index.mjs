/**
 * Copyright 2024 IBM Corp. All Rights Reserved.
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
import AssistantV2 from 'ibm-watson/assistant/v2.js';

// keep track of the session id for watsonx Assistant
let environmentId = undefined;
let assistantSessionId = undefined;

async function converse(message) {
    // set up the session if needed
    if (!assistantSessionId) {
        try {
            console.log('creating new watsonx Assistant session...');
            const body = await assistant.createSession({
                assistantId: environmentId
            });
            console.log('success!');
            assistantSessionId = body.result.session_id;
        } catch (err) {
            console.error('an error occured while creating a session for watsonx Assistant. Please check that the environmentId in tjbot.toml is defined.');
            throw err;
        }
    }

    // define the conversational turn
    const turn = {
        assistantId: environmentId,
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
        console.log(`response from assistant.message(): ${JSON.stringify(body)}`);
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
        console.error(`the watsonx Assistant service returned an error: ${err}`);
        throw err;
    }
}

async function followAction(action) {
    // figure out what action they asked us to do
    // check if a variable to control the bot was found
    var followed = false;
    if (action !== undefined) {
        switch (action) {
            case 'lower-arm':
                await tj.speak(response.description);
                tj.lowerArm();
                followed = true;
                break;
            case 'raise-arm':
                await tj.speak(response.description);
                tj.raiseArm();
                followed = true;
                break;
            case 'wave':
                await tj.speak(response.description);
                tj.wave();
                followed = true;
                break;
            case 'greeting':
                await tj.speak(response.description);
                tj.wave();
                followed = true;
                break;
            case 'shine':
                {
                    // colors to detect from the user utterance
                    const regex = /(aqua|red|green|white|blue|orange|yellow|violet|pink|on|off)/g;

                    if (utterance.match(regex)) {
                        const color = utterance.match(regex)[0];
                        console.log("color found! ", color);
                        await tj.speak(response.description);
                        tj.shine(color);
                        followed = true;
                    }
                }
                break;
            default:
                break;
        }
    }

    if (!followed) {
        await tj.speak("oh no, I wasn't able to understand your instruction! let's try again.");
    }
}

async function main() {
    // read recipe-specific config
    const config = TJBot.loadRecipeConfig();

    // these are the hardware capabilities that TJ needs for this recipe
    const hardware = [
        TJBot.Hardware.MICROPHONE,
        TJBot.Hardware.SPEAKER,
        TJBot.Hardware.SERVO
    ];

    let hasLED = false;
    if (config.useNeoPixelLED) {
        hardware.push(TJBot.Hardware.LED_NEOPIXEL);
        hasLED = true;
    }
    if (config.useCommonAnodeLED) {
        hardware.push(TJBot.Hardware.LED_COMMON_ANODE);
        hasLED = true;
    }

    // this recipe requires an LED
    if (!hasLED) {
        throw Error('this recipe requires an LED. please configure your TJBot with an LED and update your tjbot.toml file accordingly.');
    }

    // create an instance of the watsonx Assistant service
    const assistant = new AssistantV2({
        serviceName: 'assistant',
        version: '2024-08-25',
    });

    // instantiate our TJBot!
    const tj = new TJBot();
    tj.initialize(hardware);

    const instructions = ```
    Let's play Simon Says! Tell me what to do and I will do my best to follow.
    I can shine my light different colors, move my arm up and down, and repeat 
    things that you say. Don't forget to say "Simon Says"! When you want to stop 
    playing, just say "Stop".
    ```;

    // ready!
    console.log('TJBot is ready for Simon Says!');
    console.log("Say 'stop' or press ctrl-c to exit this recipe.");

    // speak the instructions
    await tj.speak(instructions);

    // now we play the game :)
    while (true) {
        const msg = await tj.listen().toLowerCase();

        if (msg === 'stop') {
            console.log('Goodbye!');
            process.exit(0);
        }

        // send to the assistant service
        const response = await converse(msg);

        // check to see if they said "Simon Says"
        if (msg.startsWith('simon says')) {
            // they said "simon says" so lets try to folow it
            await followAction(response.action);
        } else {
            // they didn't say "simon says", but we might still follow the instruction
            const rand = Math.random();
            if (rand > config.followLikelihood) {
                // follow it
                await followAction(response.action);

                // and then end the game
                await tj.speak("oh no, you didn't say simon says! good game!")
            } else {
                // don't follow it, they didn't say simon says!
                await tj.speak("you didn't say simon says! let's keep going.");
            }
        }
    }
}

// this is a little magic to avoid calling await at the top level,
// which node frowns upon
(async () => {
    try {
        await main();
    } catch (e) {
        console.log(e);
    }
})();