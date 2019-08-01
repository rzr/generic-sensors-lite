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
var webthing = require('webthing-iotjs')

var GenericSensors = null;
try {
  GenericSensors = require('../webthing/../../generic-sensors-lite.js')
} catch (err) {
  GenericSensors = require('generic-sensor-lite')
}

function start () {
  var that = this
  this.port = process.argv[2]
    ? Number(process.argv[2])
    : 8888
  this.controller = process.argv[3]
    ? String(process.argv[3])
    : 'simulator'
  this.thing = new webthing.Thing('urn:dev:opts:generic-sensors-1234',
                                  'GenericSensors')

  this.sensors = {};
  for (var name in Object.keys(GenericSensors)) {
    name = Object.keys(GenericSensors)[name];
    this.sensors[name] = {};
    this.sensors[name].sensor = new GenericSensors[name]();
    this.sensors[name].value = {};
    for (var field in this.sensors[name].sensor.properties) {
      field = this.sensors[name].sensor.properties[field];
      this.sensors[name].value[field] = new webthing.Value();

      this.thing.addProperty(new webthing.Property(
        this.thing,
        field,
        this.sensors[name].value[field],
        {
          readOnly: true,
        }
      ));
    }

    this.sensors[name].controller = new GenericSensors[name]();
    this.sensors[name].controller.parent = this.sensors[name];

    this.sensors[name].controller.onreading = function () {
      for (var field in this.properties) {
        field = this.properties[field];
        this.parent.value[field].notifyOfExternalUpdate(this[field]);
      }
    }

    this.sensors[name].controller.onactivate = function () {
      console.log('log: ' + this.type + ': onactivate:');
    };

    this.sensors[name].controller.start();
  }

  that.server = new webthing.WebThingServer(new webthing.SingleThing(that.thing),
                                            that.port)
  process.on('SIGINT', function () {
    that.server.stop()
    process.exit()
  })
  console.log('log: Serving: http://localhost:' + that.port + '/properties')
  that.server.start()

}

if (module.parent === null) {
  start()
}
