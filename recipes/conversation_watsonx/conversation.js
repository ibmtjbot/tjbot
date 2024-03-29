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
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'ibm-credentials.env' });

const APIKEY = process.env.IBM_CLOUD_APIKEY;

// these are the hardware capabilities that TJ needs for this recipe
const hardware = [TJBot.HARDWARE.MICROPHONE, TJBot.HARDWARE.SPEAKER];

let bearerToken, conversationHistory = '';
let tokenExpiration = 0;

// set up TJBot's configuration
const tjConfig = {
  log: {
    level: 'info', // change to 'verbose' or 'silly' for more detail about what TJBot is doing
  }
};

// instantiate our TJBot!
const tj = new TJBot(tjConfig);
tj.initialize(hardware);

async function token() {
  const bearer = await axios.post(
    'https://iam.cloud.ibm.com/identity/token',
    'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=' + APIKEY,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  let token = bearer.data.access_token;
  tokenExpiration = bearer.data.expires_in;
  return token;
}

// ready!
console.log('TJBot is ready for conversation!');
console.log("Say 'stop' or press ctrl-c to exit this recipe.");

while (true) {
  console.log("Listening");
  // const msg = await tj.listen();
  let msg = "Watson can you tell me a joke?"

  // check to see if they are talking to TJBot
  if (msg.toLowerCase().startsWith(config.robotName.toLowerCase())) {
    // remove our name from the message
    const utterance = msg.toLowerCase().replace(config.robotName.toLowerCase(), '').substr(1);

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
    ${conversationHistory}

    Conversation:
    Human: ${msg}
    AI: `;

    if (msg === undefined || msg === '') {
      continue;
    }

    if (msg === 'stop') {
      console.log('Goodbye!');
      process.exit(0);
    }

    // strip out %HESITATION
    msg = msg.replaceAll('%HESITATION', '');

    // if the token is expiring then generate a new one
    if (tokenExpiration < 30 || !tokenExpiration) {
      bearerToken = await token();
    }

    // call out to the LLM for a response using the prompt and user input
    const response = await axios.post(
      config.endpoint,
      {
        model_id: config.model_id,
        input: msg,
        parameters: config.parameters,
        project_id: config.project_id
      },
      {
        params: {
          version: config.version
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + bearerToken
        }
      })

    const text = response.data.results[0].generated_text;
    console.log("Response: ", text);

    tj.speak(text);

    conversationHistory += `Human: ${msg} \n AI: ${text}\n`;
  }
}
