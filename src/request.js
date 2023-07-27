/* eslint-disable no-console */
'use strict';

const http = require('http');

const BASE = 'http://localhost:8800';
const pathname = '/file/index.html';
const href = BASE + pathname;

const req = http.request(href, (res) => {
  console.log(res.statusCode);

  res.setEncoding('utf8');

  res.on('data', (data) => {
    console.log(data);
  });
});

req.end();
