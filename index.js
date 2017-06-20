'use strict';

const CronJob = require('cron').CronJob;
const gpio = require('rpi-gpio');

gpio.setup(12, gpio.DIR_OUT);
gpio.setup(32, gpio.DIR_OUT);
gpio.setup(40, gpio.DIR_OUT);

const rp = require('request-promise');

let options = {
  uri: 'http://weather.olp.yahooapis.jp/v1/place',
  qs: {
    coordinates: '139.742681,35.7299334',
    appid: process.env.YAHOO_APP_ID,
    output: 'json'
  },
  json: true
};


//new CronJob('* */10 9-22 * * 1-5', () => {
setInterval(() => {
  gpio.write(32, true);
  rp(options)
    .then((res) => {
      if (res.Feature[0].Property.WeatherList.Weather[0].Rainfall > 0) {
        gpio.write(12, true);
        gpio.write(32, false);
        gpio.write(40, false);
        console.log(new Date() + ' rainny');
      } else {
        gpio.write(12, false);
        gpio.write(32, false);
        gpio.write(40, true);
        console.log(new Date() + ' sunny');
      }
  });
}, 1000 * 60 * 1);
//}, null, true, 'Asia/Tokyo');

