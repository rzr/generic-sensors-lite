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
var Sensor = require('./simulator');

/**
 * Class inspired by W3C's generic-sensor
 * @related: https://www.w3.org/TR/ambient-light/
 **/
function Humidity(options) {
  var self = this;
  this.type = 'humidity';
  this.properties = ['level'];
  for (var property in self.properties) {
    property = this.properties[property];
    self[property] = null;
  }
  this.onerror = function (err) {
    throw new Error(err)
  }
  this.options = options || {};
  this.options.frequency = this.options.frequency || 1;
  
  return this;
}

Humidity.prototype.update = function update() {
  var self = this;
  try {
    self.hasReading = false;
    self.sensor.read(function(err, data) {
      if (err || data === null || typeof data === 'undefined') {
        return self.onerror(data);
      }
      self.timestamp = new Date();
      for (var property in self.properties) {
        property = self.properties[property];
        self[property] = data[property]
      }
      self.hasReading = true;
      if (self.onreading) {
        self.onreading();
      }
    });
  } catch (err) {
    self.onerror(err);
  }
}

Humidity.prototype.stop = function stop() {
  if ( this.state === 'idle' ) return;
  this.interval = clearInterval(this.interval);
  this.state = 'idle';
}

Humidity.prototype.start = function start() {
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

module.exports = Humidity;


if (module.parent === null) {
  var sensor = new Humidity();
  sensor.onreading = function() {
    console.log('log: level=' + this.level);
    this.stop();
  }
  sensor.start();
}
