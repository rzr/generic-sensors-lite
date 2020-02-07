# GENERIC-SENSORS-LITE #

[![GitHub forks](https://img.shields.io/github/forks/rzr/generic-sensors-lite.svg?style=social&label=Fork&maxAge=2592000)](https://GitHub.com/rzr/generic-sensors-lite/network/)
[![license](https://img.shields.io/badge/license-Apache-2.0.svg)](LICENSE)
[![NPM](https://img.shields.io/npm/v/generic-sensors-lite.svg)](https://www.npmjs.com/package/generic-sensors-lite)
[![Build Status](https://api.travis-ci.org/rzr/generic-sensors-lite.svg?branch=master)](https://travis-ci.org/rzr/generic-sensors-lite)
[![dependencies Status](https://david-dm.org/rzr/generic-sensors-lite/status.svg)](https://david-dm.org/rzr/generic-sensors-lite)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frzr%2Fgeneric-sensors-lite.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Frzr%2Fgeneric-sensors-lite?ref=badge_shield)

[![NPM](https://nodei.co/npm/generic-sensors-lite.png)](https://npmjs.org/package/generic-sensors-lite)


## INTRODUCTION: ##

Lightweight implementation of W3C spec, targeting constrained devices.

Several JavaScript runtimes are supported (node.js, IoT.js using JerryScript)

[![Presentation](https://image.slidesharecdn.com/webthing-iotjs-20181022rzr-181027220201/95/webthingiotjs20181022rzr-34-638.jpg)](https://www.slideshare.net/slideshow/embed_code/key/BGdKOn9HHRF4Oa#webthing-iotjs# "WebThingIotJs")


## USAGE: ##

By default simulator are used and generate random values,
but following sensors can be plugged on pins of your favorite single board computer:

* BH1650: for measuring illuminance  (i2c=0x23)
* BMPx80: for measuring temperature, or any compatible sensor (ie: BMP180, i2c=0x77)
* TCS34725: for measuring colors (i2c=0x29)
* HTU21D: for measuring humidity (i2c=0x40) [Buy](
https://www.amazon.com/HiLetgo%C2%AE-Temperature-Humidity-1-5V-3-6V-Compatible/dp/B00XR7CR1I/ref=rzr-21#
)

#### SETUP: ####

Privileged access to hardware resources is also required too (setup or use sudo).

For instance on Raspbian:

``` 
sudo raspi-config # Enable I2C
ls -l /dev/i2c* || sudo reboot
sudo apt-get install i2c-tools
/usr/sbin/i2cdetect -y 1
#|      0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
#| 00:          -- -- -- -- -- -- -- -- -- -- -- -- -- 
#| 10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
#| 20: -- -- -- 23 -- -- -- -- -- 29 -- -- -- -- -- -- 
#| 30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
#| 40: 40 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
#| 50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
#| 60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
#| 70: -- -- -- -- -- -- -- 77
```

#### USING NODE.JS: ####

```
git clone --recursive https://github.com/rzr/generic-sensors-lite
cd generic-sensors-lite

npm install
npm start
#| node example/index.js 
#| (...)
#| {"illuminance": 123.}
#| (...)
#| {"celsius": 42.}
#| (...)
(...)

```


#### USING IOT.JS ####

For constrained environments:

```
make start
#| (...)
#| iotjs example/index.js 
#| (...)
#| {"illuminance": 123.}
#| (...)
#| {"celsius": 42.}
#| (...)
```

Note: It has been verified on GNU/Linux not TizenRT yet (TODO).


#### USING NODE.JS ####

```sh
node lib/ambientlight "{ \"controller\": \"bh1750\"}"
```


### DEMO: ###

[![web-of-things-agriculture-20180712rzr.webm
](
https://camo.githubusercontent.com/8c693d7e5d3950831e7f7fd62aa1dc790a6100f8/68747470733a2f2f732d6f70656e736f757263652e6f72672f77702d636f6e74656e742f75706c6f6164732f323031382f30372f7765622d6f662d7468696e67732d6167726963756c747572652d3230313830373132727a722e676966#/generic-sensors-lite.gif
)](
https://player.vimeo.com/video/279677314#web-of-things-agriculture-20180712rzr.webm
"Video Demo"
)

An extra example is provided to show integration in Mozilla's Thing project.
Sensors are powered by webthing-iotjs and monitored on dashboard as progressive web app (PWA).

Usage:

```sh
make runtime=iotjs start
make -C example/webthing runtime=iotjs start
#| (...)
log: Serving: http://localhost:8888/properties
#| (...)

curl  http://localhost:8888/properties
#| { (...) "illuminance":123., "celsius":42., "color":"#c0a175" (...) } 
```

Respectively node could be supported too,
just adapt to webthing-node API instead of webthing-iotjs (TODO):

```sh
make -C example/webthing runtime=node start
#| (...)
```


## RESOURCES: ##

* https://www.npmjs.com/package/generic-sensors-lite
* https://github.com/rzr/generic-sensors-lite
* https://medium.com/samsung-internet-dev/sensors-webthings-bc48ad9963dd#
* https://w3c.github.io/sensors/#section-mock-sensor-type
* https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs
* https://github.com/rzr/mozilla-iot-generic-sensors-adapter
* https://s-opensource.org/2018/04/25/mozilla-iot-generic-sensors/
* https://github.com/miroRucka/bh1750/pull/17
* https://github.com/dbridges/bmp085-sensor/pull/7
* https://github.com/samsunginternet/color-sensor-js
* https://github.com/samsung/iotjs/wiki
* https://github.com/samsung/iotjs
* http://www.iotjs.net/
* http://jerryscript.net/
* https://github.com/rzr/webthing-iotjs/wiki/IotJs
* https://github.com/rzr/webthing-iotjs/wiki/Sensor
* https://social.samsunginter.net/@rzr/100969945665369600
* https://travis-ci.org/rzr/generic-sensors-lite



## LICENSE: ##

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frzr%2Fgeneric-sensors-lite.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Frzr%2Fgeneric-sensors-lite?ref=badge_large)
