'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class

  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
  };

  return http.createServer(async (req, res) => {
    if (req.url.includes('//')) {
      res.writeHead(404, {
        'Content-type': 'text/plain',
      });
      res.end('Source is not found');

      return;
    }

    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const filePath = normalizedUrl.pathname;

    if (filePath.includes('../')) {
      res.writeHead(400, {
        'Content-type': 'text/plain',
      });

      res.end('Bad request');

      return;
    }

    if (!filePath.startsWith('/file')) {
      res.writeHead(200, {
        'Content-type': 'text/plain',
      });
      res.end('Try to request with /file/');

      return;
    }

    let fileName = filePath;

    if (filePath === '/file/') {
      fileName = 'index.html';
    } else if (filePath === '/file') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Try to request with /file/');

      return;
    }

    if (fileName.startsWith('/file/')) {
      fileName = fileName.slice(6);
    }

    try {
      const ext = path.extname(fileName);
      const contentType = contentTypes[ext] || 'text/plain';
      const file = await fs.readFile(`./public/${fileName}`);

      res.writeHead(200, {
        'Content-type': contentType,
      });
      res.end(file);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, {
          'Content-Type': 'text/plain',
        });
        res.end('File is not exists');
      } else {
        res.writeHead(400, {
          'Content-type': 'text/plain',
        });
        res.end('Something went wrong');
      }
    }
  });
}

module.exports = {
  createServer,
};
