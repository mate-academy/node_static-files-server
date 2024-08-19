'use strict';

const url = require('url');
const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    const normalizeUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const pathName = normalizeUrl.pathname;
    const arrayFromPathName = pathName.slice(1).split('/');

    if (pathName.includes('//')) {
      res.writeHead(404, {
        'Content-Type': 'text/plain',
      });

      return res.end(
        'Path to file should be like this /file/folderName/filename',
      );
    }

    if (arrayFromPathName.includes('..')) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });

      return res.end(
        JSON.stringify({
          error: 'Path to file should be like this /file/folderName/filename',
        }),
      );
    }

    if (!pathName.startsWith('/file/')) {
      res.writeHead(404, {
        'Content-Type': 'text/plain',
      });

      return res.end(
        'Path to file should be like this /file/folderName/filename',
      );
    }

    const slicedPathName = arrayFromPathName.slice(1).join('/');

    if (!fs.existsSync(`./public/${slicedPathName}`)) {
      res.writeHead(404, 'Content-Type', 'text/plain');

      return res.end('File does not exist');
    }

    if (!fs.existsSync(`./public/${slicedPathName}`)) {
      res.writeHead(404, 'File not found', {
        'Content-Type': 'text/plain',
      });

      return res.end('Path does not exist');
    }

    const filePath = path.join(__dirname, '../public', slicedPathName);

    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        res.writeHead(404, 'File not found', {
          'Content-Type': 'text/plain',
        });
        res.end('File not found');
      } else {
        res.writeHead(200, 'ok', {
          'Content-Type': 'text/plain',
        });

        res.end(data);
      }
    });
  });
}

module.exports = {
  createServer,
};
