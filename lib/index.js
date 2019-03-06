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

var console = require('console');
var ColorSensor = require('color-sensor-js/example');


module.exports = {
  AmbientLight: require('./ambientlight'),
  Geolocation: require('./geolocation'),
  Temperature: require('./temperature'),
};

module.exports.Color = function(options) {
  if (!options) {
    options = { controller: 'tcs34725' };
  }

  return (new ColorSensor(options));
}


if (module.parent === null) {
  for (var type in module.exports) {
    var sensor = new module.exports[type]()
    sensor.onerror = function(err) {
      console.error('error: ' + type + ' failure: ' + err );
      this.stop();
    }
    sensor.onactivate = function() {
      var that = this;
      setTimeout(function(){that.stop()}, 4000);
    }
    sensor.onreading = function() {
      console.log('log: ' + this.timestamp + ' update ' + this.type)
    }
    try {
      sensor.start();
    } catch(err) {
        console.error('error: ' + type + ' failure: ' + err );
    }
  }
}
