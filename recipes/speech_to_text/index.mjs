/**
 * Copyright 2016-2024 IBM Corp. All Rights Reserved.
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

// let's have a disco party!
function discoParty(tj, colors) {
    for (let i = 0; i < 30; i += 1) {
        setTimeout(() => {
            const randIdx = Math.floor(Math.random() * colors.length);
            const randColor = colors[randIdx];
            tj.shine(randColor);
        }, i * 250);
    }
}

async function main() {
    // read recipe-specific config
    const config = TJBot.loadRecipeConfig();

    // these are the hardware capabilities that our TJ needs for this recipe
    const hardware = [
        TJBot.Hardware.MICROPHONE
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

    // instantiate our TJBot!
    const tj = new TJBot();
    tj.initialize(hardware);

    // full list of colors that TJ recognizes, e.g. ['red', 'green', 'blue']
    const tjColors = tj.shineColors();

    console.log('TJBot is ready to shine!');
    console.log("I understand lots of colors.  You can tell me to shine my light a different color by saying 'turn the light red' or 'change the light to green' or 'turn the light off'.");
    console.log("Say 'stop' or press ctrl-c to exit this recipe.");

    // uncomment to see the full list of colors TJ understands
    // console.log("Here are all the colors I understand:");
    // console.log(tjColors.join(", "));

    // hash map to easily test if TJ understands a color, e.g. {'red': 1, 'green': 1, 'blue': 1}
    const colors = {};
    tjColors.forEach((color) => {
        colors[color] = 1;
    });

    // listen for speech
    while (true) {
        const msg = await tj.listen();

        if (msg === 'stop') {
            console.log('Goodbye!');
            process.exit(0);
        }

        const containsTurn = msg.indexOf('turn') >= 0;
        const containsChange = msg.indexOf('change') >= 0;
        const containsSet = msg.indexOf('set') >= 0;
        const containsLight = msg.indexOf('the light') >= 0;
        const containsDisco = msg.indexOf('disco') >= 0;

        if ((containsTurn || containsChange || containsSet) && containsLight) {
            // was there a color uttered?
            const words = msg.split(' ');
            for (let i = 0; i < words.length; i += 1) {
                const word = words[i];
                if (colors[word] !== undefined || word === 'on' || word === 'off') {
                    // yes!
                    tj.shine(word);
                    break;
                }
            }
        } else if (containsDisco) {
            discoParty(tj, tjColors);
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
