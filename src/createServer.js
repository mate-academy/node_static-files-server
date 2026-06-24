'use strict';

const http = require('http');
const fs = require('fs/promises');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class

  return http.createServer(async (req, res) => {
    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('Source is not found');

      return;
    }

    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const filePath = normalizedUrl.pathname;

    if (!filePath.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Bad request');

      return;
    }

    let fileName;

    if (filePath === '/file/') {
      fileName = 'index.html';
    } else if (filePath === '/file') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('You should request with /file/');

      return;
    }

    fileName = filePath.slice(6);

    try {
      const file = await fs.readFile(`./public/${fileName}`);

      res.end(file);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, {
          'Content-Type': 'text/plain',
        });
        res.end('File is not exists');
      } else {
        res.end('Something went wrong');
      }
    }
  });
}

module.exports = {
  createServer,
};
