/* eslint-disable no-console */
'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-type', 'text/plain');

    const validFileRequestPrefixes = ['/file/', '/file'];
    const defaultFilePath = '/public/index.html';
    const defaultDirectoryName = 'public';
    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`)
      .pathname;
    let endOfPath = '';

    console.log(normalizedUrl);

    if (!normalizedUrl.startsWith('/file')) {
      res.statusCode = 400;
      res.end('The path should start with "/file"');
    }

    if (/(\/{2,})/.test(normalizedUrl)) {
      res.statusCode = 404;
      res.end('Duplicate slashes are not allowed');
    }

    if (validFileRequestPrefixes.includes(normalizedUrl)) {
      endOfPath = defaultFilePath;
    } else {
      endOfPath = normalizedUrl.replace(/^\/file/, `/${defaultDirectoryName}`);
    }

    const resolvedPath = path.join(__dirname, '..', endOfPath);

    fs.readFile(resolvedPath, (err, data) => {
      if (err) {
        res.statusCode = 404;

        return res.end('No such file');
      }

      res.statusCode = 200;
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
