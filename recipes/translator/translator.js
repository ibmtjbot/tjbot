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

import TJBot from 'tjbot';
import config from './config.js';

// these are the hardware capabilities that our TJ needs for this recipe
const hardware = [TJBot.HARDWARE.MICROPHONE, TJBot.HARDWARE.SPEAKER];

// set up TJBot's configuration
const tjConfig = {
    log: {
        level: 'silly', // change to 'verbose' or 'silly' for more detail about what TJBot is doing
    },
};

// instantiate our TJBot!
const tj = new TJBot(tjConfig);
tj.initialize(hardware);

// load translatable languages
const languages = tj.translatableLanguages();

console.log(`Greetings from your TJBot translator! Please speak to me in English, and I will translate your words into ${config.targetLanguage}.`);
console.log(`I can also translate to these other languages. Update your config.js to specify which one you wish to use!`);
console.log(languages.map((l) => l.language_name).join(', '));

const target = tj.languageCodeForLanguage(config.targetLanguage);

// listen for speech and translate
// tj.listen((msg) => {
//     const translated = await tj.translate(msg, 'en', target);
//     await tj.speak(translated);
// });
