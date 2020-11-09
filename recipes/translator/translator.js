/* eslint-disable import/extensions */
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
        level: 'info', // change to 'verbose' or 'silly' for more detail about what TJBot is doing
    },
};

// instantiate our TJBot!
const tj = new TJBot(tjConfig);
tj.initialize(hardware);

// load translatable languages
const allLanguages = await tj.translatableLanguages('en');
const languages = [];

// this is the language we are translating to
const languageCode = tj.codeForLanguage(config.translateLanguage);

// figure out which languages we can translate to
// a) because we can speak in that language, and
// b) because we can translate English to that language
let sttLanguage = TJBot.LANGUAGES.ENGLISH_US;
for (const [key, value] of Object.entries(TJBot.LANGUAGES.SPEAK)) {
    const code = value.substring(0, 2);

    // can the translator service translate to this language?
    if (allLanguages.includes(code)) {
        languages.push(code);
    }

    // if the prefix matches the target language (e.g. en-US matches en),
    // use this voice
    if (code === languageCode) {
        sttLanguage = value;
    }
}

// these are all of the languages to which we can translate
const languageList = languages.map((l) => tj.languageForCode(l)).join(', ');

// make sure we recognize the language desired
if (languageCode === undefined) {
    console.log(`Unknown language ${config.translateLanguage}, please specify one of these languages to translate to in config.js.`);
    console.log(languageList);
    process.exit(0);
}

// set TJBot's language
tj.configuration.speak.language = sttLanguage;

console.log(`Greetings from your TJBot translator! Please speak to me in English, and I will translate your words into ${config.translateLanguage}.`);
console.log(`I can also translate to these other languages: ${languageList}`);
console.log("Update your config.js to try another language!")
console.log(`Using STT voice: ${sttLanguage}`);
console.log("Press ctrl-c to exit this recipe.");

// listen for speech and translate
while (true) {
    const message = await tj.listen();
    let translated = { description: message };

    // just in case someone wants an echo bot...
    if (languageCode !== 'en') {
        translated = await tj.translate(message, 'en', languageCode);
        console.log(`translation: ${translated.description}`);
        
    }
    
    await tj.speak(translated.description);
}
