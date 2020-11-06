/* eslint-disable no-undef */
/**
 * Copyright 2020 IBM Corp. All Rights Reserved.
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
import fs from 'fs';
import { exec } from 'child_process';
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
tjbot.initialize([TJBot.HARDWARE.CAMERA]);

// take a picture -- use the internal method to avoid the 
// _assertCapability() check, which will fail because we don't
// have (or need) credentials for Watson Visual Recognition in this test
const filePath = await tjbot._takePhoto();
if (!fs.existsSync(filePath)) {
    throw new Error(`expected photo to exist at path ${filePath}`);
}

// open the picture
exec(`gpicview ${filePath}`);

// did it display?
console.log("Please note this test will only work from a local terminal window on your");
console.log("Raspberry Pi and will not display an image when run via SSH.");
confirm(`show a picture from the camera`);

// clean up
if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
}
