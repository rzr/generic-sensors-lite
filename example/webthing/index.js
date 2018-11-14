/* -*- mode: js; js-indent-level:2;  -*-
   SPDX-License-Identifier: Apache-2.0 */
/* Copyright 2018-present Samsung Electronics Co., Ltd. and other contributors
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
var console = require('console');
var webthing = require('webthing');
var Property = webthing.Property;
var SingleThing = webthing.SingleThing;
var Thing = webthing.Thing;
var Value = webthing.Value;
var WebThingServer = webthing.WebThingServer;

var GenericSensors = require('generic-sensors-lite');

var log = console.log;
var verbose = !console.log || function() {};


function AmbientLightProperty(thing, name, value, metadata, config) {
  var self = this;
  name = name || 'AmbientLight';
  value = value || 0;
  metadata = metadata || {};
  metadata.description = metadata.description || 'AmbientLight Sensor';
  metadata.label = metadata.label || 'Illuminance';
  config = config || {};
  config.frequency = config.frequency || 1;

  Property.call(this, thing, name,
                new Value(Number(value)),
                {
                  '@type': 'NumberProperty',
                  description: metadata,
                  label: metadata.label,
                  readOnly: true,
                  type: 'number',
                });
  {
    this.period = 1000.0 / config.frequency;
    this.config = config;
    this.sensor = new GenericSensors.AmbientLight();

    this.sensor.onreading = function() {
      verbose("log: " + self.sensor.type + ": " + self.sensor.illuminance);
      var updatedValue = Number(self.sensor.illuminance);

      if (updatedValue !== self.lastValue) {
        log("log: AmbientLight: " + self.getName() + ": change: " + updatedValue);
        self.value.notifyOfExternalUpdate(updatedValue);
        self.lastValue = updatedValue;
      }
    };
    this.sensor.onerror = function(err) {
      console.error("error: AmbientLight: " + self.getName() + ": Fail to open: " + err);
      self.sensor.stop();
    }
    this.sensor.onactivate = function() {
      verbose("log: AmbientLight: " + self.getName() + ": onactivate:");
    }
    this.sensor.start();
  }

  self.close = function () {
    try {
      this.sensor.stop();
    } catch (err) {
      return err;
    }
    log("log: AmbientLight: " + this.getName() + ": close:");
  };

  return this;
}


function TemperatureProperty(thing, name, value, metadata, config) {
  var self = this;
  name = name || 'Temperature';
  value = value || 0;
  metadata = metadata || {};
  metadata.description = metadata.description || 'Temperature Sensor';
  metadata.label = metadata.label || 'Celsius';
  config = config || {};
  config.frequency = config.frequency || 1;

  Property.call(this, thing, name,
                new Value(Number(value)),
                {
                  '@type': 'NumberProperty',
                  description: metadata,
                  label: metadata.label,
                  readOnly: true,
                  type: 'number',
                });
  {
    this.period = 1000.0 / config.frequency;
    this.config = config;
    this.sensor = new GenericSensors.Temperature();

    this.sensor.onreading = function() {
      verbose("log: " + self.sensor.type + ": " + self.sensor.celsius);
      var updatedValue = Number(self.sensor.celsius);

      if (updatedValue !== self.lastValue) {
        log("log: Temperature: " + self.getName() + ": change: " + updatedValue);
        self.value.notifyOfExternalUpdate(updatedValue);
        self.lastValue = updatedValue;
      }
    };
    this.sensor.onerror = function(err) {
      console.error("error: Temperature: " + self.getName() + ": Fail to open: " + err);
      self.sensor.stop();
    }
    this.sensor.onactivate = function() {
      verbose("log: Temperature: " + self.getName() + ": onactivate:");
    }
    this.sensor.start();
  }

  self.close = function () {
    try {
      this.sensor.stop();
    } catch (err) {
      return err;
    }
    log("log: AmbientLight: " + this.getName() + ": close:");
  };

  return this;
}


function main () {
  var port = process.argv[2]
      ? Number(process.argv[2])
      : 8888;

  var thing = new Thing('GenericSensors', [], 'A set of sensors');
  thing.addProperty(new AmbientLightProperty(thing));
  thing.addProperty(new TemperatureProperty(thing));
  var server = new WebThingServer(new SingleThing(thing), port);
  process.on('SIGINT', function () {
    server.stop();
  });
  server.start();
}

main();
