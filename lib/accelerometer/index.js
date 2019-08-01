/* -*- mode: js; js-indent-level:2; -
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019-present Samsung Electronics France and other contributors
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
var Sensor = require('./simulator');

/**
 * Class inspired by W3C's generic-sensor
 * @related: https://www.w3.org/TR/ambient-light/
 **/
function Accelerometer(options) {
  this.type = 'Accel';
  this.properties = ['x', 'y', 'z'];
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.onerror = function (err) {
    throw new Error(err)
  }
  this.options = options || {};
  this.options.frequency = this.options.frequency || 1;
  
return this;
}

Accelerometer.prototype.update = function update() {
  var self = this;
  try {
    self.hasReading = false;
    self.sensor.read(function(err, data) {
      if (err || data === null || typeof data === 'undefined') {
        return self.onerror(data);
      }
      self.timestamp = new Date();
      self.x = data.x;
      self.y = data.y;
      self.z = data.z;
      self.hasReading = true;
      if (self.onreading) {
        self.onreading();
      }
    });
  } catch (err) {
    self.onerror(err);
  }
}

Accelerometer.prototype.stop = function stop() {
  if ( this.state === 'idle' ) return;
  this.interval = clearInterval(this.interval);
  this.state = 'idle';
}

Accelerometer.prototype.start = function start() {
  var self = this;
  this.state = 'activating';
  if (!this.sensor) {
    try {
      this.sensor = new Sensor();
    } catch (err) {
      if (this.onerror) {
        return this.onerror(err)
      }
    }
  }

  try {
    if (!self.interval) {
      self.interval = setInterval(function() { self.update(); },
                                  1000. / self.options.frequency);
      if (self.onactivate) {
        self.onactivate();
      }
      self.state = 'activated';
    }
  } catch(err) {
    self.onerror(err);
  }
}

module.exports = Accelerometer;


if (module.parent === null) {
  var sensor = new Accelerometer();
  sensor.onreading = function() {
    console.log('log: x=' + this.y + ', y=' + this.y + ', z=' + this.z + ' - ' + this.timestamp);
    this.stop();
  }
  sensor.start();
}
