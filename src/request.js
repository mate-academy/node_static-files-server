/* eslint-disable no-console */
'use strict';

const http = require('http');

const options = {
  port: 8080,
  hostname: 'localhost',
  path: '/file/index.html',
};

http.get(options, (res) => {
  res.setEncoding('utf-8');
  res.on('data', console.log);
});
