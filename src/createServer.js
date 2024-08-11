'use strict';

const http = require('http');
const fs = require('fs');

const PREFIX = 'file';
const PUBLIC_FOLDER = './public';

function createServer() {
  const server = http.createServer(async (req, res) => {
    if (req.url.includes('..')) {
      res.statusCode = 400;
      res.end('Bad URL');

      return;
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('Bad path');

      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}/`);

    res.setHeader('Content-Type', 'text/plain');

    const pathname = url.pathname.slice(1);

    if (!pathname.startsWith(PREFIX)) {
      res.statusCode = 200;

      res.end(
        `Path should start with '/file/'. For example: ${req.headers.host}/file/photo.jpg`,
      );

      return;
    }

    const filename = pathname.replace(PREFIX, '') || 'index.html';
    const filePath = `${PUBLIC_FOLDER}/${filename}`;

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end("File doesn't exists");

      return;
    }

    try {
      const file = await fs.promises.readFile(filePath, 'utf-8');

      res.statusCode = 200;
      res.end(file);
    } catch (error) {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
