/* eslint-disable no-console */
'use strict';

const http = require('http');

const options = {
  host: 'localhost',
  port: 3000,
  method: 'GET',
  path: '/file/styles/main.css',
  // Try next line to check is it possible to get files outside of public folder
  // path: '/file/../readme.md',
};

const request = http.request(options, res => {
  console.log(res.statusCode);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk.toString();
  });

  res.on('end', () => {
    console.log(data);
  });
});

request.end();
