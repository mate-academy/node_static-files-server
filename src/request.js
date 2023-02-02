/* eslint-disable no-console */
'use strict';

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/file/../app.js',
};

http.get(options, (res) => {
  res.setEncoding('utf-8');

  console.log(res.statusCode);

  res.on('data', data => {
    console.log(data);
  });
});
