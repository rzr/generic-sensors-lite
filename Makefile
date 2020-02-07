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

default: all
	@echo "log: $@: $^"


project?=generic-sensors-lite
tmp_dir ?= tmp
runtime ?= iotjs
export runtime
eslint ?= node_modules/eslint/bin/eslint.js
srcs_dir ?= .
srcs ?= $(wildcard *.js */*.js | sort | uniq)
run_args ?=
run_timeout ?= 10
main_src ?= example/index.js
test_src ?= lib/index.js
NODE_PATH := .:${NODE_PATH}
export NODE_PATH

iotjs_modules_dir?=${CURDIR}/iotjs_modules

bh1750_url?=https://github.com/abandonware/bh1750
bh1750_revision?=v0.0.7-0
bmp085-sensor_url?=https://github.com/abandonware/bmp085-sensor
bmp085-sensor_revision?=v0.0.6-1
color-sensor-js_url?=https://github.com/rzr/color-sensor-js
color-sensor-js_revision?=v0.0.11

iotjs_modules_dirs+=${iotjs_modules_dir}/@abandonware/bh1750
iotjs_modules_dirs+=${iotjs_modules_dir}/@abandonware/bmp085-sensor
iotjs_modules_dirs+=${iotjs_modules_dir}/color-sensor-js

IOTJS_EXTRA_MODULE_PATH?=.
export IOTJS_EXTRA_MODULE_PATH

help:
	@echo "## Usage: "

all: build
	@echo "log: $@: $^"

node_modules: package.json
	npm install

package-lock.json: package.json
	rm -fv "$@"
	npm install
	ls "$@"

setup/node: node_modules
	@echo "NODE_PATH=$${NODE_PATH}"
	node --version
	npm --version

setup: setup/${runtime}
	@echo "log: $@: $^"

build/%: setup
	@echo "log: $@: $^"

build/node: setup node_modules lint
	@echo "log: $@: $^"

build: build/${runtime}
	@echo "log: $@: $^"

run/%: ${main_src} build
	${@F} $< ${run_args}

run/npm: ${main_src} setup
	npm start

run: run/${runtime}
	@echo "log: $@: $^"

clean:
	rm -rf ${tmp_dir}

cleanall: clean
	rm -f *~

distclean: cleanall
	rm -rf node_modules

test/npm: package.json
	npm test

test/${runtime}: ${test_src} ${runtime}/modules
	${@F} $<

test: test/${runtime}
	@echo "log: $@: $^"

start: run
	@echo "log: $@: $^"

check/%: ${srcs}
	${MAKE} setup
	@echo "log: SHELL=$${SHELL}"
	status=0 ; \
 for src in $^; do \
 echo "log: check: $${src}: ($@)" ; \
 ${@F} $${src} \
 && echo "log: check: $${src}: OK" \
 || status=1 ; \
 done ; \
	exit $${status}

check/npm:
	npm run lint

check/iotjs:
	@echo "TODO: Temporary disabled"

check: lint check/${runtime}
	@echo "log: $@: $^"

node_modules/%:
	npm install
	ls $@

${eslint}: node_modules/eslint
	ls $<

eslint/setup: ${eslint}
	${eslint} --version


.eslintrc.js: ${eslint}
	ls $@ || $< --init

eslint: ${eslint}
	node $< --fix . ||:
	-git diff
	-git status
	node $< --fix .

lint/%: eslint
	@echo "log: $@: $^"

lint: lint/${runtime}
	@echo "log: $@: $^"

${iotjs_modules_dir}: ${iotjs_modules_dirs}
	ls $@

${iotjs_modules_dir}/%:
	-mkdir -p ${@D}
	git clone --recursive --depth=1 --branch="${${@F}_revision}" "${${@F}_url}" "$@"
	-make -C ${@} modules iotjs_modules_dir="${iotjs_modules_dir}"

setup/iotjs: ${iotjs_modules_dir}
	${@F} -h ||:

rule/npm/version/%: package.json
	-git describe --tags
	cd example/webthing && npm version ${@F}
	-git add example/webthing/package*.json
	-git commit -sam "webthing: Update version to ${@F}"
	-git add package*.json
	npm version ${@F}


iotjs_modules: ${iotjs_modules_dirs}
	ls $<

iotjs/modules: ${runtime}_modules
	ls $<

modules: ${runtime}/modules
	@echo "log: $@: $^"
