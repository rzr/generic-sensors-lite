## GENERIC SENSORS LITE ##

Lightweight implementation of W3C spec, targeting constrained devices.

Several JS engines will be supported.


## USAGE ##

Following sensors can be plugged on pins of your favorite single board computer:

* I2C
 * BH1650: for mesuring illuminance
 * BMP085: for mesuring temperature, or any compatible sensor (ie: BMP180)

Privilleged access to hardware resources is also requiered too (setup or use sudo).


### USING NODE.JS ###

```
git clone --recursive https://github.com/rzr/generic-sensors-lite
cd generic-sensors-lite
npm install
npm test all
(...)
log: temperature: 28.1
log: ambientlight: 51
log: temperature: 28.1
log: temperature: 28.1
log: ambientlight: 51
(...)

```


## RESOURCES ##

* https://w3c.github.io/sensors/
