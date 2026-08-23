/* eslint-disable padding-line-between-statements */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

function createServer() {
  return http.createServer((req, res) => {
    const { url } = req;

    if (!url.startsWith('/file/')) {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });

      res.end('To get a file, use /file/<file-path>');
      return;
    }

    const filePath = url.slice('/file/'.length);

    if (url.includes('/../')) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });

      res.end('Invalid path');
      return;
    }

    if (url.includes('//')) {
      res.writeHead(404, {
        'Content-Type': 'text/plain',
      });

      res.end('File not found');
      return;
    }

    const requestedFile = filePath === '' ? 'index.html' : filePath;

    const fullPath = path.join(__dirname, '..', 'public', requestedFile);

    fs.readFile(fullPath, (error, data) => {
      if (error) {
        res.writeHead(404, {
          'Content-Type': 'text/plain',
        });

        res.end('File not found');
        return;
      }

      const extension = path.extname(fullPath);

      let contentType = 'text/plain';

      if (extension === '.html') {
        contentType = 'text/html';
      } else if (extension === '.css') {
        contentType = 'text/css';
      }

      res.writeHead(200, {
        'Content-Type': contentType,
      });

      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
