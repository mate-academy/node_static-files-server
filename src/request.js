'use strict';
/* eslint-disable no-console */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/file/',
};

http.get(options, (res) => {
  res.setEncoding('utf-8');
  res.on('data', console.log);
});
