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
var GeolocationSensor = require('./geolocation');
var HumiditySensor = require('./humidity');
var AmbientLightSensor = require('./ambientlight');
var TemperatureSensor = require('./temperature');


module.exports = {};

module.exports.AmbientLight = function(options) {
  if (!options) {
    options = { controller: 'bh1750' };
  }
  
return (new AmbientLightSensor(options));
}

module.exports.Color = function(options) {
  if (!options) {
    options = { controller: 'tcs34725' };
  }
  
return (new ColorSensor(options));
}

module.exports.Geolocation = function(options) {
  if (!options) {
    options = { controller: 'simulator' };
  }

  return (new GeolocationSensor(options));
}

module.exports.Humidity = function(options) {
  if (!options) {
    options = { controller: 'htu21d' };
  }

  return (new HumiditySensor(options));
}

module.exports.Temperature = function(options) {
  if (!options) {
    options = { controller: 'bmp085' };
  }

  return (new TemperatureSensor(options));
}


if (module.parent === null) {
  for (var type in module.exports) {
    console.log('log: Trying type=' + type);
    var sensor = new module.exports[type]()
    sensor.onerror = function(err) {
      console.error('error: ' + this.type + ' failure: ' + err );
      this.stop();
    }
    sensor.onactivate = function() {
      var that = this;
      setTimeout(function(){that.stop()}, 10000);
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
