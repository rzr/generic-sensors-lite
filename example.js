// -*- mode: js; js-indent-level:2; -*-
// SPDX-License-Identifier: Apache-2.0
/* Copyright 2018-present Samsung Electronics France
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var GenericSensors = null;
try {
  GenericSensors = require('generic-sensors-lite');
} catch (err) {
  GenericSensors = require('./index.js');
}

var ambientlight = new GenericSensors.AmbientLight({ frequency: 1 });
ambientlight.onreading = function() {
    console.log("log: " + ambientlight.type + ": " + ambientlight.illuminance);
};
ambientlight.onerror = function(err) {
  console.log('error: ' + ambientlight.type + ': ' + err);
  ambientlight.stop();
}
ambientlight.onactivate = function() {
  setTimeout(function(){ambientlight.stop();} , 3000);
}
ambientlight.start();

