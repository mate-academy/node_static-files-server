/* eslint-disable no-console */
'use strict';

const http = require('http');

const BASE = 'http://localhost:3007';

const href = BASE
+ '/file/index.txt';

const req = http.request(href, (res) => {
  res.setEncoding('utf8');
  console.log(res.statusCode);
  res.on('data', console.log);
});

req.on('error', console.warn);

req.end();
