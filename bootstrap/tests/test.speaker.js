/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
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

'use strict';

const readline = require('readline');
const assert = require('assert');

const TJBot = require('tjbot');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var tj = new TJBot(['speaker'], {}, {});

var sound = '/usr/share/sounds/alsa/Front_Center.wav';
tj.play(sound).then(function() {
    rl.question('Did you hear the words "Front Center"? Y/N', (answer) => {
        assert(answer.toLowerCase() == 'y', 'expected audio to play, please check that you speaker is plugged in, turned on, and set as the current audio output device.');
    });
});

rl.close();
