'use strict';

const http = require('http');
const { getPathToFile } = require('./getPathToFile');
const { getFileByPath } = require('./getFileByPath');

function createServer() {
  return http.createServer((request, response) => {
    getPathToFile(request)
      .then(getFileByPath)
      .then(response.end)
      .catch(error => {
        response.setHeader('Content-Type', 'text/plain');
        response.statusCode = error.code;
        response.end(error.message);
      });
  });
}

module.exports = {
  createServer,
};
