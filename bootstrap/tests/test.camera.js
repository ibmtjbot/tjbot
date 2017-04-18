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

'use strict';

const fs = require('fs');

const TJBot = require('tjbot');

// just need tjbot to think that it is capable of seeing, don't 
// actually need real Watson credentials for this test
const dummyWatsonCredentials = {
    visual_recognition: {
        api_key: 'abc-def-ghi'
    }
};

var tj = new TJBot(['camera'], {log: {level: 'debug'}}, dummyWatsonCredentials);
tj.takePhoto('picture.jpg').then(function(data) {
    if (!fs.existsSync('picture.jpg')) {
        throw new Error("expected picture.jpg to have been created");
    }
    console.log("picture taken successfully, removing the file");
    if (fs.existsSync('picture.jpg')) {
        fs.unlink('picture.jpg');
    }
});
