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
import readline from 'readline';

async function main() {
    // Read recipe-specific config
    const config = TJBot.loadRecipeConfig();

    // These are the hardware capabilities that our TJ needs for this recipe
    const hardware = [
        TJBot.Hardware.SPEAKER
    ];

    // Instantiate our TJBot!
    const tj = new TJBot();
    tj.initialize(hardware);

    console.log('TJBot is ready to speak!');
    console.log("Type 'stop' or press ctrl-c to exit this recipe.\n");

    // Create the readline interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Function to prompt the user for input and respond
    const askQuestion = () => {
        rl.question('What would you like TJBot to say? ', (answer) => {
            // If the user types 'stop', exit the loop and close the interface
            if (answer.toLowerCase() === 'stop') {
                tj.speak('Goodbye!');
                rl.close();
                process.exit(0);
            }

            // TJBot speaks the user's input
            console.log('You said:', answer);
            tj.speak(answer);
            
            // Wait 2 seconds before asking again
            setTimeout(() => {
                askQuestion();
            }, 2000);
        });
    };

    askQuestion();
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