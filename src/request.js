/* eslint no-console: "error" */

'use strict';
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/file/styles/main.css',
}

http.get(options, (res) => {
  res.setEncoding('utf8');
  res.on('data', (data) => {
    console.log(data);
  })
});
