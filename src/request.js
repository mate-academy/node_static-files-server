/* eslint-disable no-console */
'use strict';

const http = require('http');

function request(path) {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path,
  };

  return new Promise((resolve, reject) => {
    http.get(options, (res) => {
      res.setEncoding('utf-8');

      res.on('data', (data) => {
        resolve({
          res, data,
        });
      });
    });
  });
}

// const newCall = async() => {
//   const { res, data } = await request('/file/index.html');

//   console.log(data.includes('<!DOCTYPE html>'), res.statusCode);
// };

// newCall();

module.exports = { request };
