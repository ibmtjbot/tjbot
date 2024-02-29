/* eslint-disable import/extensions */
/**
 * Copyright 2023 IBM Corp. All Rights Reserved.
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

// these are the hardware capabilities that TJ needs for this recipe
const hardware = [TJBot.HARDWARE.MICROPHONE, TJBot.HARDWARE.SPEAKER];

// set up TJBot's configuration
const tjConfig = {
    log: {
        level: 'info', // change to 'verbose' or 'silly' for more detail about what TJBot is doing
    }
};

// instantiate our TJBot!
const tj = new TJBot(tjConfig);
tj.initialize(hardware);

let tokenExpiration;
let bearerToken;

async function token() {
    const bearer = await axios.post(
    'https://iam.cloud.ibm.com/identity/token',
    'grant_type=urn:ibmbee:params:oauth:grant-type:apikey&apikey=APIKEY',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  const bearerToken = bearer.data.access_token;
  tokenExpiration = bearer.data.expiration;
  console.log("bearer token: ", bearerToken);
}

// define the prompt template
const prompt = 
    `You are TJBot, a friendly and helpful social robot made out of cardboard.
    You are having a conversation with a human.
    You provide friendly and helpful responses to everything the human says.
    You respond to their questions in a professional manner.
    You never use inappropriate language like swear words or hate speech.
    You aim to be delightful and energetic in your responses.
    If you don't know the answer to a question, you respond truthfully that you do not know.
    
    Conversation summary:
    {history}

    Conversation:
    Human: {input}
    AI: `;

// ready!
console.log('TJBot is ready for conversation!');
console.log("Say 'stop' or press ctrl-c to exit this recipe.");

while (true) {
    const msg = await tj.listen();

    if (msg === undefined || msg === '') {
        continue;
    }

    if (msg === 'stop') {
        console.log('Goodbye!');
        process.exit(0);
    }

    // strip out %HESITATION
    msg = msg.replaceAll('%HESITATION', '');

    // check to see if the bearer token has expired
    // if expired, bearerToken = token();
    // else continue;
    
      const response = await axios.post(
        'https://us-south.ml.cloud.ibm.com/ml/v1-beta/generation/text',
        {
          model_id: 'ibm/granite-13b-instruct-v2',
          input: 'Please translate the following sentence to Spanish: Hello how are you today?',
          parameters: {
            decoding_method: 'greedy',
            max_new_tokens: 20,
            min_new_tokens: 0,
            stop_sequences: [],
            repetition_penalty: 1
          },
          project_id: 'WATSONX_PROJECT_ID'
        },
        {
          params: {
            version: '2023-05-29'
          },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + bearerToken
          }
        })



    const { text } = await conversation.predict({ input: msg });

    tj.speak(text);
}
