/* eslint-disable no-undef */
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

import rl from 'readline-sync';
import TJBot from 'tjbot';

function confirm(behavior) {
    let answer = rl.question(`Did TJBot ${behavior} (Y/n)? `);
    if (answer === '') {
        answer = 'y';
    }
    if (answer.toLowerCase() !== 'y') {
        throw new Error(`TJBot did not ${behavior}`);
    }
}

const tjbot = new TJBot({ log: { level: 'silly' } });
tjbot.initialize([TJBot.HARDWARE.LED]);

// shine various colors
let answer;
const colors = ["red", "green", "blue", "orange", "purple"];

colors.forEach((color) => {
    tjbot.shine(color);
    confirm(`shine the light ${color}`);
});

// pulse
await tjbot.pulse('red');
await tjbot.pulse('red');
await tjbot.pulse('red');
confirm(`pulse the light red`);
