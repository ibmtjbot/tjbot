/* eslint-disable import/extensions */
/**
 * Copyright 2023-2024 IBM Corp. All Rights Reserved.
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
import config from './config.js';
import axios from 'axios';
import reader from 'readline-sync';

// keep track of the conversational history
let conversationHistory = '';

// used for IBM Cloud authentication
let bearerToken = '';
let bearerTokenExpiration = 0;

async function token() {
    console.log("🍪 requesting new IBM Cloud authentication token");
    const bearer = await axios.post(
        'https://iam.cloud.ibm.com/identity/token',
        'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=' + config.ibm_cloud_apikey,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return {
        token: bearer.data.access_token,
        expiration: bearer.data.expires_in
    };
}

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });


while (true) {
    // if the token is expiring then generate a new one
    if (bearerToken === '' || bearerTokenExpiration < 30) {
        token = await token();
        bearerToken = token.token;
        bearerTokenExpiration = token.expiration;
        console.log("🥠 fetched new IBM Cloud authentication token that expires in " + bearerTokenExpiration + " seconds");
    }

    const msg = await reader.question(`👩‍💻 > `);

    if (msg.toLowerCase() === 'stop') {
        console.log('Goodbye!');
        process.exit(0);
    }

    // build the prompt
    const prompt = `You are TJBot, a friendly and helpful social robot made out of cardboard.
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

    // call out to the LLM for a response using the prompt and user input
    const response = await axios.post(
        config.endpoint,
        {
            model_id: config.model_id,
            input: prompt,
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
        });

    const text = response.data.results[0].generated_text;
    console.log("🤖 > " + text);

    // add to the conversation history
    conversationHistory += `Human: ${msg}\n AI: ${text}\n\n`;
}
