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

var TJBot = require('tjbot');
var config = require('./config');

// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
var WORKSPACEID = config.conversationWorkspaceId;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['microphone', 'speaker'];

// turn on debug logging to the console
var tjConfig = {
    verboseLogging: false
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// listen for utterances with our attentionWord and send the result to
// the Conversation service
tj.listen(function(msg) {
    // check for an attention word
    if (msg.startsWith(tj.configuration.attentionWord)) {
        // remove the attention word from the message
        var turn = msg.toLowerCase().replace(tj.configuration.attentionWord.toLowerCase(), "");
        
        // send to the conversation service
        tj.converse(WORKSPACEID, turn, function(response) {
            // speak the result
            tj.speak(response.description);
        });
    }
});
