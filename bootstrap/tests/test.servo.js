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

const rl = require('readline-sync');

const TJBot = require('tjbot');

var tj = new TJBot(['servo'], {log: {level: 'debug'}}, {});

tj.armBack();
var answer = rl.question('Is TJBot\'s arm in the BACKWARD position? Y/N > ');
if (answer.toLowerCase() != 'y') {
    throw new Error('expected arm to be in backward position, please check servo wiring.');
}

tj.raiseArm();
answer = rl.question('Is TJBot\'s arm in the RAISED position? Y/N > ');
if (answer.toLowerCase() != 'y') {
    throw new Error('expected arm to be in raised position, please check servo wiring.');
}

tj.lowerArm();
answer = rl.question('Is TJBot\'s arm in the LOWERED position? Y/N > ');
if (answer.toLowerCase() != 'y') {
    throw new Error('expected arm to be in lowered position, please check servo wiring.');
}

tj.wave();
answer = rl.question('Did TJBot wave? Y/N > ');
if (answer.toLowerCase() != 'y') {
    throw new Error('expected tj to wave, please check servo wiring.');
}
