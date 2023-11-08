/* eslint-disable no-console */
'use strict';

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3006,
  // path: '/file/index.html',
  path: '/file/styles/main.css',
  // path: '/file',
};

http.get(options, res => {
  res.setEncoding('utf8');
  console.log(res.statusCode);
  res.on('data', console.log);
});
