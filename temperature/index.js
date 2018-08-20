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

var BMP085 = require('bmp085-sensor');

/**
 * Class inspired by W3C's generic-sensor
 * @related: https://www.w3.org/TR/generic-sensor/
 **/
function TemperatureSensor(options) {
  this.state = 'construct';

  this.type = 'temperature';
  this.celsius = 0;

  this.onerror = function(err) {
    throw new Error(err);
  };
  this.onactivate = function() {};
  this.onreading = function() {};

  this.level = 'low';
  this.activated = false;
  this.interval = null;

  this.options = options || { frequency : 1 };
  this.options.controller = options.controller || 'bmp085';
  if ((this.options.controller === 'bmp085') || (this.options.controller === 'bmp180')) {
    this.sensor = new BMP085(this.options.sensor);
  } else {
    throw new Error("TODO: unsupported controller:" + this.options.controller);
  }
  this.state = 'idle';

  return this;
}

TemperatureSensor.prototype.update = function update() {
  var self = this;
  try {
    self.hasReading = false;
    self.sensor.read(function (err, data) {
      if (err) {
        return self.onerror(err);
      }
      if ((data === null) || (typeof data === 'undefined')) {
        return self.onerror("Invalid data");
      } else {
        self.timestamp = new Date();
        self.celsius = Number(data.temperature);
        self.hasReading = true;
        self.onreading();
        self.hasReading = false;
      }
    });
  } catch (err) {
    self.onerror(err);
  }
}

TemperatureSensor.prototype.stop = function stop() {
  if ( this.state === 'idle' ) return;
  this.interval = clearInterval(this.interval);
  this.state = 'idle';
}

TemperatureSensor.prototype.start = function start() {
  var self = this;
  self.state = 'activating';
  try {
    self.sensor.calibrate(function (err /* , data*/) {
      if (err) {
        throw err;
      }
      if (!self.interval) {
        self.interval = setInterval(function() { self.update(); },
                                    1000. / self.options.frequency);
        self.onactivate();
        self.state = 'activated';
      }
    });
    
  } catch(err) {
    self.onerror(err);
  }
}

module.exports = TemperatureSensor;
