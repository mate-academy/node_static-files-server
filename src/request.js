'use strict';
/* eslint-disable no-console */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/file/..index.html',
};

http.get(options, (res) => {
  res.setEncoding('utf8');
  res.on('data', console.log);
  console.log(res.statusCode);
});
