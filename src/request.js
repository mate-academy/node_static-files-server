/* eslint-disable no-console */
'use strict';

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/',
};

http.get(options, (res) => {
  res.setEncoding('utf8');
  res.on('data');
});
