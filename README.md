## GENERIC SENSORS LITE ##

Lightweight implementation of W3C spec, targeting constrained devices.

Several JS engines will be supported.

[![NPM](https://nodei.co/npm/generic-sensors-lite.png)](https://npmjs.org/package/generic-sensors-lite)


## USAGE: ##

Following sensors can be plugged on pins of your favorite single board computer:

* I2C:
  * BH1650: for measuring illuminance
  * BMP085: for measuring temperature, or any compatible sensor (ie: BMP180)

#### SETUP: ####

Privileged access to hardware resources is also required too (setup or use sudo).

For instance on Raspbian:

``` 
sudo raspi-config # Enable I2C
ls -l /dev/i2c* || sudo reboot
sudo apt-get install i2c-tools
/usr/sbin/i2cdetect -y 1

     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- -- 
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
20: -- -- -- 23 -- -- -- -- -- -- -- -- -- -- -- -- 
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
70: -- -- -- -- -- -- -- 77
```

#### USING NODE.JS: ####

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


### DEMO: ###

[![web-of-things-agriculture-20180712rzr.webm](https://media.giphy.com/media/tKyrtKMc77iV9QUCrP/giphy.gif)](https://player.vimeo.com/video/279677314#web-of-things-agriculture-20180712rzr.webm "Video Demo")



## RESOURCES: ##

* https://www.npmjs.com/package/generic-sensors-lite
* https://github.com/rzr/generic-sensors-lite
* https://w3c.github.io/sensors/
