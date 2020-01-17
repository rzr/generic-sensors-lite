/* -*- mode: js; js-indent-level:2; -
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2020-present Philippe Coval and other contributors
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

var console = require('console');

function Simulator () {
  this.level = 100.;
}

Simulator.prototype.readHumidity = function (callback) {
  this.level = Math.random();
  if (callback) return callback(null, this.level);
};

module.exports = Simulator;

if (module.parent === null) {
  var sensor = new Simulator();
  sensor.readHumidity(function (err, value) {
    if (err) {
      console.error('error: ' + err);
      throw err;
    } else {
      console.log('log: value=' + JSON.stringify(value));
    }
  });
}
