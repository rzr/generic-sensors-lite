#_!/bin/make -f
# -*- makefile -*-
# SPDX-License-Identifier: Apache-2.0
#{
# Copyright 2018-present Samsung Electronics France
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#}

default: help
	@echo "log: $@: $^"

runtime?=iotjs
top_dir?=../..
base_url?=http://localhost:8888
webthing_url?=https://github.com/rzr/webthing-iotjs

help:
	@echo "# Usage:"
	@echo "# make runtime=iotjs run"

iotjs_modules/webthing-iotjs:
	@mkdir -p $@
	git clone --depth 1 --recursive ${webthing_url} $@

iotjs_modules/webthing-iotjs/%: iotjs_modules/webthing-iotjs
	@ls $@

iotjs/run: index.js iotjs_modules/webthing-iotjs/index.js
	IOTJS_EXTRA_MODULE_PATH=${top_dir}:${top_dir}/iotjs_modules iotjs $<

iotjs/debug: iotjs_modules index.js
#	rm -rf node_modules
	NODE_PATH=${<}:${top_dir}:${top_dir}/${<F}:node_modules node index.js

test:
	curl ${base_url}
	@echo
	curl ${base_url}/properties

node_modules: package.json
	npm install

node/run: node_modules
	npm start

run: ${runtime}/run
	@echo "# $@: $^"
