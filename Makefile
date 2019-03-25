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

bh1750_url?=https://github.com/miroRucka/bh1750
# TODO: https://github.com/miroRucka/bh1750/issues/20
bh1750_revison?=master
iotjs-async_url?=https://github.com/rzr/iotjs-async
# TODO: https://github.com/dbridges/bmp085-sensor/pull/7
bmp085-sensor_revision?=master
bmp085-sensor_url?=https://github.com/tizenteam/bmp085-sensor
color-sensor-js_url?=https://github.com/SamsungInternet/color-sensor-js
#color-sensor-js_revision=TODO

iotjs_modules_dirs+=${iotjs_modules_dir}/bh1750
iotjs_modules_dirs+=${iotjs_modules_dir}/bmp085-sensor
iotjs_modules_dirs+=${iotjs_modules_dir}/color-sensor-js

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
	git clone --recursive --depth 1 https://github.com/TizenTeam/${@F} $@

${iotjs_modules_dir}/bh1750:
	-mkdir -p ${@D}
	git clone --recursive --depth 1 ${bh1750_url} $@

${iotjs_modules_dir}/async:
	-mkdir -p ${@D}
	git clone --recursive --depth 1 ${iotjs-async_url} $@

${iotjs_modules_dir}/bmp085-sensor: ${iotjs_modules_dir}/async
	-mkdir -p ${@D}
	git clone --recursive --depth 1 ${bmp085-sensor_url} $@

${iotjs_modules_dir}/color-sensor-js:
	-mkdir -p ${@D}
	git clone --recursive --depth 1 ${color-sensor-js_url} $@

setup/iotjs: ${iotjs_modules_dir}
	${@F} -h ||:

rule/npm/version/%: package.json
	-git describe --tags
	cd example/webthing && npm version ${@F}
	-git add example/webthing/package*.json
	-git commit -sam "webthing: Update version to ${@F}"
	-git add package*.json
	npm version ${@F}

iotjs/modules: ${iotjs_modules_dir}
	ls $<
