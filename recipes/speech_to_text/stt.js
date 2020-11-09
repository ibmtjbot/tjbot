/* eslint-disable import/extensions */
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

// these are the hardware capabilities that our TJ needs for this recipe
const hardware = [TJBot.HARDWARE.LED_NEOPIXEL, TJBot.HARDWARE.MICROPHONE];

// set up TJBot's configuration
const tjConfig = {
    log: {
        level: 'info', // change to 'verbose' or 'silly' for more detail about what TJBot is doing
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

// instantiate our TJBot!
const tj = new TJBot(tjConfig);
tj.initialize(hardware);

// full list of colors that TJ recognizes, e.g. ['red', 'green', 'blue']
const tjColors = tj.shineColors();

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
        // discoParty();
    }
}

// let's have a disco party!
/*
function discoParty() {
    for (let i = 0; i < 30; i += 1) {
        setTimeout(() => {
            const randIdx = Math.floor(Math.random() * tjColors.length);
            const randColor = tjColors[randIdx];
            tj.shine(randColor);
        }, i * 250);
    }
}
*/
