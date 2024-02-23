'use strict';

const http = require('http');
const { getPathToFile } = require('./getPathToFile');
const { getFileByPath } = require('./getFileByPath');

function createServer() {
  return http.createServer((request, response) => {
    getPathToFile(request)
      .then(getFileByPath)
      .then(data => response.end(data))
      .catch(error => {
        response.setHeader('Content-Type', 'text/plain');
        response.statusCode = error.code || 500;

        response.end(error.code === 500 ? 'Server error' : error.message);
      });
  });
}

module.exports = {
  createServer,
};
