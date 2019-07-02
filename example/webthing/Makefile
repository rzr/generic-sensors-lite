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
topreldir?=../..
base_url?=http://localhost:8888

iotjs_modules_dir?=${CURDIR}/iotjs_modules
example_file?=index.js

webthing-iotjs_url?=https://github.com/rzr/webthing-iotjs
webthing-iotjs_revision?=webthing-iotjs-0.11.3-0
webthing-iotjs_dir?=${iotjs_modules_dir}/webthing-iotjs
iotjs_modules_dirs+=${webthing-iotjs_dir}

IOTJS_EXTRA_MODULE_PATH?=${topreldir}/iotjs_modules
export IOTJS_EXTRA_MODULE_PATH

help:
	@echo "# Usage:"
	@echo "# make runtime=iotjs run"


${webthing-iotjs_dir}:
	git clone --recursive --depth 1 ${webthing-iotjs_url} -b ${webthing-iotjs_revision} $@
	make -C $@ deploy deploy_modules_dir=${iotjs_modules_dir}

${deploy_module_dir}/%: %
	@echo "# TODO: minify: $< to $@"
	install -d ${@D}
	install $< $@

${deploy_modules_dir}/webthing-iotjs: ${iotjs_modules_dir}/webthing-iotjs
	make -C $< deploy deploy_modules_dir="${deploy_modules_dir}"

node_modules: package.json
	npm install

node/start: node_modules
	npm start

iotjs/start: ${example_file} iotjs_modules
	iotjs $< ${run_args}

run: start
	@echo "# $@: $^"

start: ${runtime}/start
	@echo "# $@: $^"

modules: ${runtime}/modules
	@echo "# $@: $^"

iotjs_modules: ${topreldir}/iotjs_modules ${iotjs_modules_dirs}
	ls $<

${topreldir}/iotjs_modules:
	${MAKE} -C ${@D} modules

distclean:
	rm -rf node_modules
	rm -rf iotjs_modules
