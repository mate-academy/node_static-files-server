/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  return http.createServer((reques, respons) => {
    respons.setHeader('Content-type', 'text/plain');

    const normalize = new url.URL(reques.url, `http://${reques.headers.host}`);
    const preparedPath = normalize.pathname.split('/').filter(Boolean);
    let redactedURL;

    if (preparedPath[0] === 'file' || preparedPath.length === 1) {
      redactedURL = 'public/index.html';
    }

    if (preparedPath.length > 1) {
      redactedURL = `public/${preparedPath.slice(1).join('/')}`;
    }

    if (preparedPath[0] !== 'file') {
      respons.statusCode = 400;

      return respons.end('Use path /file/<file_name>');
    }

    if (normalize.pathname.includes('//')) {
      respons.statusCode = 404;

      return respons.end('Not use // in path');
    }

    fs.readFile(redactedURL, (error, data) => {
      if (error) {
        respons.statusCode = 404;
        respons.end('No such a file');
      }

      respons.statusCode = 200;
      respons.end(data);
    });
  });
}

module.exports = {
  createServer,
};
