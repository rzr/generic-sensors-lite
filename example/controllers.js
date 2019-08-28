/* -*- mode: js; js-indent-level:2;  -*-
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2018-present Samsung Electronics Co., Ltd. and other contributors
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

var GenericSensors = null;
try {
  GenericSensors = require('../example/../lib/controllers.js')
} catch (err) {
  GenericSensors = require('generic-sensors-lite')
}

function start () {
  this.sensors = {};
  for (var name in Object.keys(GenericSensors)) {
    name = Object.keys(GenericSensors)[name];
    try {
      this.sensors[name] = {};
      this.sensors[name].sensor = new GenericSensors[name]();
      this.sensors[name].value = {};
      for (var field in this.sensors[name].sensor.properties) {
        field = this.sensors[name].sensor.properties[field];
      }

      this.sensors[name].controller = new GenericSensors[name]();

      this.sensors[name].controller.onreading = function () {
        for (var field in this.properties) {
          field = this.properties[field];
          console.log('{"' + field + '": ' + this[field] + '}');
        }
      }

      this.sensors[name].controller.onactivate = function () {
        console.log('log: ' + this.type + ': onactivate:');
      };

      this.sensors[name].controller.start();
    } catch(err) {
      console.log('error: sensor: ' + name);
      console.log(err);
    }
  }
  process.on('SIGINT', function () {
    process.exit()
  })
}

if (module.parent === null) {
  start()
}
