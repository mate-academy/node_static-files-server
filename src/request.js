/* eslint-disable no-console */
'use strict';

const http = require('http');

const BASE_URL = `http://localhost:3000`;
const pathname = '/file/';

const req = http.request(BASE_URL + pathname, (res) => {
  res.setEncoding('utf8');

  res.on('data', (data) => {
    console.log(data);
  });
});

req.on('error', (error) => {
  console.log(error);
});

req.end();
