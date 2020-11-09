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

import TJBot from 'tjbot';

const tjbot = new TJBot({ log: { level: 'silly' } });
tjbot.initialize([TJBot.HARDWARE.MICROPHONE]);

console.log('Note: This test requires credentials for the Speech to Text service stored in the ibm-credentials.env file.');
console.log('If you see an error about "Missing required parameters: apikey", it is because TJBot was unable');
console.log('to find credentials for Speech to Text.');
console.log();
console.log('TJBot is listening and will echo what you say on the console. Say "stop" to stop the test.');

while (true) {
    const msg = await tjbot.listen();
    console.log(msg);
    if (msg.startsWith('stop')) {
        process.exit(0);
    }
}
