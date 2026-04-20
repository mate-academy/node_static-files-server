'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { validateRequest } = require('./validateRequest');

const createServer = () => {
  return http.createServer((req, res) => {
    const fileName = req.url.slice(1);

    const { code, message } = validateRequest(fileName);

    if (!code) {
      fs.readFile(
        path.join('public', fileName.replace(/^file\/?/, '') || 'index.html'),
        (err, data) => {
          if (!err) {
            res.statusCode = 200;
            res.end(data);
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end("file doesn't exist");
          }
        },
      );
    } else {
      res.statusCode = code;
      res.setHeader('Content-Type', 'text/plain');
      res.end(message);
    }
  });
};

module.exports = {
  createServer,
};
