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
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';

async function main() {
    // read recipe-specific config
    const config = TJBot.loadRecipeConfig();

    // these are the hardware capabilities that TJ needs for this recipe
    const hardware = [
        TJBot.Hardware.MICROPHONE,
        TJBot.Hardware.SPEAKER,
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

    // create an instance of the watsonx.ai service
    const wxai = WatsonXAI.newInstance({
        serviceUrl: config.serviceUrl,
        version: config.serviceVersion,
    });

    // instantiate our TJBot!
    const tj = new TJBot();
    tj.initialize(hardware);

    // ready!
    console.log('TJBot is ready for conversation!');
    console.log("Say 'stop' or press ctrl-c to exit this recipe.");
    await tj.speak(`Hello! I'm T J Bot. What language would you like to translate to?`);
    let language = await tj.listen();
    await tj.speak(`Ok. I will be ready to translate your phrase to ${language} when my light turns green.`);

    while (true) {
        console.log('👂 listening...');

        if (hasLED) {
            tj.shine('green');
        }

        let msg = await tj.listen();

        if (hasLED) {
            tj.pulse('orange');
        }

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
You are acting as a translator with a human.
You provide friendly and helpful responses to everything the human says.
You never use inappropriate language like swear words or hate speech.
You aim to be delightful and energetic in your responses.
Take the input phrase and then translate it to ${language}.
Your only output should be the final translated text.

Input: ${msg}.
Output: 
 `;

        const params = {
            input: prompt,
            modelId: config.modelId,
            projectId: config.projectId,
            parameters: {
                decoding_method: config.modelDecodingMethod,
                temperature: config.modelTemperature,
                random_seed: config.modelRandomSeed,
                min_new_tokens: config.modelMinNewTokens,
                max_new_tokens: config.modelMaxNewTokens,
                stop_sequences: config.modelStopSequences,
                repetition_penalty: config.modelRepetitionPenalty,
            },
        };

        try {
            const response = await wxai.generateText(params);
            const text = response.result.results[0].generated_text;

            console.log(`👩‍💻 > ${msg}`);
            console.log(`🤖 > ${text}`);

            console.log('🗯️ speaking...');
            if (hasLED) {
                tj.pulse('yellow');
            }
            await tj.speak(text);
            console.log('🗯️ speaking finished');
        } catch (err) {
            console.warn(`⚠️ > ${err}`);
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
