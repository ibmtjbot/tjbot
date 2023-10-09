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

import { GenAIModel } from '@ibm-generative-ai/node-sdk/langchain';
import { PromptTemplate } from 'langchain/prompts';
// import { LLMChain } from 'langchain/chains';
import { ConversationChain } from 'langchain/chains';
import { ConversationSummaryBufferMemory } from 'langchain/memory'


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

// load watsonx.ai model
const model = new GenAIModel({
    modelId: 'ibm/granite-13b-chat-v1',
    parameters: {},
    configuration: {
        apiKey: config.apiKey,
        endpoint: config.endpoint
    }
});

// define the prompt template
const prompt = PromptTemplate.fromTemplate(
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
    AI: `);

// use conversational memory
const memory = new ConversationSummaryBufferMemory({
    llm: model,
    memory_key: "history"});

// create the conversation chain for conversation
const conversation = new ConversationChain({
    llm: model,
    prompt: prompt,
    memory: memory,
    verbose: true,
});

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

    const { text } = await conversation.predict({ input: msg });

    tj.speak(text);
}