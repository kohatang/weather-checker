'use strict';

const CronJob = require('cron').CronJob;
const fs = require('fs');
const dir = '/sys/class/gpio';
const gpio12 = dir + '/gpio12';
const gpio18 = dir + '/gpio18';
const gpio21 = dir + '/gpio21';

try {
  fs.writeFileSync(dir + '/unexport', 12);
  fs.writeFileSync(dir + '/unexport', 18);
  fs.writeFileSync(dir + '/unexport', 21);
} catch (err) {
  console.log('unexport error');
}

fs.writeFileSync(dir + '/export', 12);
fs.writeFileSync(gpio12 + '/direction', 'out');
fs.writeFileSync(dir + '/export', 18);
fs.writeFileSync(gpio18 + '/direction', 'out');
fs.writeFileSync(dir + '/export', 21); 
fs.writeFileSync(gpio21 + '/direction', 'out'); 

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
  fs.writeFileSync(gpio12 + '/value', '1');
  rp(options)
    .then((res) => {
      if (res.Feature[0].Property.WeatherList.Weather[0].Rainfall > 0) {
        fs.writeFileSync(gpio12 + '/value', '0');
        fs.writeFileSync(gpio21 + '/value', '0');
        fs.writeFileSync(gpio18 + '/value', '1');
        console.log(new Date() + ' rainny');
      } else {
        fs.writeFileSync(gpio12 + '/value', '0');
        fs.writeFileSync(gpio21 + '/value', '1');
        fs.writeFileSync(gpio18 + '/value', '0');
        console.log(new Date() + ' sunny');
      }
  });
}, 1000 * 60 * 1);
//}, null, true, 'Asia/Tokyo');

