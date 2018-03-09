## GENERIC SENSORS LITE ##

Lightweight implementation of W3C spec, targeting constrained devices.

Several JS engines will be supported.


## USAGE ##

Following sensors can be plugged on pins of your favorite single board computer:

* I2C:
  * BH1750: for mesuring illuminance
  * BMP085: for mesuring temperature, or any compatible sensor (ie: BMP180)

Privilleged access to hardware resources is also requiered too (setup or use sudo).


### USING NODE.JS ###

```
git clone --recursive https://github.com/rzr/generic-sensors-lite
cd generic-sensors-lite
npm install
npm test
(...)
log: temperature: 28.1
log: ambientlight: 51
log: temperature: 28.1
log: temperature: 28.1
log: ambientlight: 51
(...)

```


### USING IOT.JS ###

```
mkdir -p iotjs_modules
cd iotjs_modules
git clone https://github.com/rzr/async-lite
git clone https://github.com/TizenTeam/bh1750 -b sandbox/rzr/devel/iotjs/master
git clone https://github.com/TizenTeam/bmp085 -b sandbox/rzr/devel/iotjs/master
cd -
IOTJS_EXTRA_MODULE_PATH=iotjs_modules iotjs example
log: temperature: 27.8
log: ambientlight: 30
log: temperature: 27.8
log: temperature: 27.7
log: ambientlight: 15
(...)
```


## RESOURCES ##

* https://w3c.github.io/sensors/
* https://www.npmjs.com/~rzr
* https://www.npmjs.com/package/bh1750
* https://www.npmjs.com/package/bmp085
