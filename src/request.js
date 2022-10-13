/* eslint-disable no-console */
'use strict';

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/file/style/main.css',
};

http.get(options, (res) => {
  res.setEncoding('utf-8');
  res.on('data', console.log);
});
