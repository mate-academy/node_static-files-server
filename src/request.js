/* eslint-disable no-console */
'use strict';

const http = require('http');
const nodeUrl = require('url');
const nodePath = require('path');

const myUrl = new nodeUrl.URL('http://localhost:8800');

myUrl.pathname = nodePath.join('file');

const req = http.request(myUrl, (res) => {
  if (res.statusCode === 404) {
    console.log('File was not found');
  }

  if (res.statusCode === 200) {
    console.log('Succssesfully');
  }

  res.setEncoding('utf8');

  res.on('data', (data) => {
    console.log(data);
  });
});

req.end();
