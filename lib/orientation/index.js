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
function Orientation(options) {
  this.type = 'Orientation';
  this.properties = ['quaternion'];
  this.quaternion = [0, 0, 0, 0];
  this.onerror = function (err) {
    throw new Error(err)
  }
  this.options = options || {};
  this.options.frequency = this.options.frequency || 1;
  
return this;
}

Orientation.prototype.update = function update() {
  var self = this;
  try {
    self.hasReading = false;
    self.sensor.read(function(err, data) {
      if (err || data === null || typeof data === 'undefined') {
        return self.onerror(data);
      }
      self.timestamp = new Date();
      self.quaternion = data;
      self.hasReading = true;
      if (self.onreading) {
        self.onreading();
      }
    });
  } catch (err) {
    self.onerror(err);
  }
}

Orientation.prototype.stop = function stop() {
  if ( this.state === 'idle' ) return;
  this.interval = clearInterval(this.interval);
  this.state = 'idle';
}

Orientation.prototype.start = function start() {
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

module.exports = Orientation;


if (module.parent === null) {
  var sensor = new Orientation();
  sensor.onreading = function() {
    console.log('log: quaternion=[' + this.quaternion + ']');
    this.stop();
  }
  sensor.start();
}
