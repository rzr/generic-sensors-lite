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
try {
  var BH1750 = require('bh1750');
} catch (err) {
  // console.log(err);
}
var Simulator = require('./simulator');

/**
 * Class inspired by W3C's generic-sensor
 * @related: https://www.w3.org/TR/ambient-light/
 **/
function AmbientLight(options) {
  this.state = 'idle';
  this.type = 'ambientlight';
  this.illuminance = 0;

  this.onerror = function(err) {
    throw new Error(err);
  };
  this.onactivate = function() {};
  this.onreading = function() {};

  this.level = 'low';
  this.activated = false;
  this.interval = null;

  this.options = options || {};
  this.options.frequency = this.options.frequency || 1;
  this.options.controller = this.options.controller || 'simulator';

  return this;
}

AmbientLight.prototype.update = function update() {
  var self = this;
  try {
    self.hasReading = false;
    self.sensor.readLight(function (err, data) {
      if (err || (data === null) || (typeof data === 'undefined')) {
        return self.onerror(data);
      } else {
        self.timestamp = new Date();
        self.illuminance = Number(data);
        self.hasReading = true;
        self.onreading();
        self.hasReading = false;
     }
    });
  } catch (err) {
    self.onerror(err);
  }
}

AmbientLight.prototype.stop = function stop() {
  if ( this.state === 'idle' ) return;
  this.interval = clearInterval(this.interval);
  this.state = 'idle';
}

AmbientLight.prototype.start = function start() {
  var self = this;
  this.state = 'activating';
  if (!this.sensor) {
    try {
      if (this.options.controller === 'simulator') {
        this.sensor = new Simulator();
      } else if (this.options.controller === 'bh1750') {
        this.sensor = new BH1750(this.options.sensor);
      } else {
        throw new Error("TODO: unsupported controller:" + this.options.controller);
      }
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
      self.onactivate();
      self.state = 'activated';
    }
  } catch(err) {
    self.onerror(err);
  }
}

module.exports = AmbientLight;


if (module.parent === null) {
  var sensor = new AmbientLight();
  sensor.onreading = function() {
    console.log('log: ' + this.illuminance)
    this.stop();
  }
  sensor.start();
}
