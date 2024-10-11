/* eslint-disable import/extensions */
/**
 * Copyright 2023-2024 IBM Corp. All Rights Reserved.
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
import fs from 'fs';
import { resolve } from 'import-meta-resolve';
import TOML from '@iarna/toml';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';

// read recipe-specific config
const configPath = resolve('./tjbot.toml', import.meta.url);
const configData = fs.readFileSync(new URL(configPath), 'utf8');
let config = TOML.parse(configData);

// these are the hardware capabilities that TJ needs for this recipe
const hardware = [TJBot.Hardware.MICROPHONE, TJBot.Hardware.SPEAKER, TJBot.Hardware.LED_NEOPIXEL];
let hasLED = false;

if (config.Recipe.useNeoPixelLED) {
    hardware.append(TJBot.Hardware.LED_NEOPIXEL);
    hasLED = true;
}
if (config.Recipe.useCommonAnodeLED) {
    hardware.append(TJBot.Hardware.LED_COMMON_ANODE);
    hasLED = true;
}

// create an instance of the watsonx.ai service
const wxai = WatsonXAI.newInstance({
    serviceUrl: config.Recipe.serviceUrl,
    version: config.Recipe.serviceVersion,
});

// keep track of the conversational history
let conversationHistory = '';

// instantiate our TJBot!
const tj = new TJBot();
tj.initialize(hardware);

// ready!
console.log('TJBot is ready for conversation!');
console.log("Say 'stop' or press ctrl-c to exit this recipe.");

while (true) {
    console.log("👂 listening...");

    if (hasLED) {
        tj.shine('green');
    }
    let msg = await tj.listen();
    if (hasLED) {
        tj.pulse('orange');
    }

    // // // check to see if they are talking to TJBot
    // // if (msg.toLowerCase().startsWith(config.robotName.toLowerCase())) {
    //     // remove our name from the message
    //     const utterance = msg.toLowerCase().replace(config.robotName.toLowerCase(), '').substr(1);

        // define the prompt template
    
    if (msg === undefined || msg === '') {
        continue;
    }

    if (msg.toLowerCase() === 'stop') {
        console.log('Goodbye!');
        process.exit(0);
    }

    // strip out %HESITATION
    msg = msg.replaceAll('%HESITATION', '');

    // build the prompt
    const prompt = `
You are TJBot, a friendly and helpful social robot made out of cardboard.
You are having a conversation with a human.
You provide friendly and helpful responses to everything the human says.
You respond to their questions in a professional manner.
You never use inappropriate language like swear words or hate speech.
You aim to be delightful and energetic in your responses.
If you don't know the answer to a question, you respond truthfully that you do not know.

Conversation summary:
${conversationHistory}

Conversation:

Human: ${msg}
AI: `;

    const params = {
        input: prompt,
        modelId: config.Recipe.modelId,
        projectId: config.Recipe.projectId,
        parameters: {
            decoding_method: config.Recipe.modelDecodingMethod,
            max_new_tokens: config.Recipe.modelMaxNewTokens,
            min_new_tokens: config.Recipe.modelMinNewTokens,
            stop_sequences: config.Recipe.modelStopSequences,
            repetition_penalty: config.Recipe.modelRepetitionPenalty,
        }
    };

    try {
        const response = await wxai.generateText(params);
        const text = response.result.results[0].generated_text;
        
        console.log("👩‍💻 > " + msg);
        console.log("🤖 > " + text);

        console.log("🗯️ speaking...");
        if (hasLED) {
            tj.pulse('yellow');
        }
        await tj.speak(text);
        console.log("🗯️ speaking finished");

        // add to the conversation history
        conversationHistory += `Human: ${msg}\n AI: ${text}\n\n`;

    } catch (err) {
        console.warn("⚠️ > " + err);
    }
}
