'use strict';

const http = require('http');
const fs = require('fs');

const PREFIX = '/file';
const PUBLIC_FOLDER = './public/';

function createServer() {
  const server = http.createServer(async (req, res) => {
    // one test doesn't pass without this check
    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('Bad path');

      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}/`);

    res.setHeader('Content-Type', 'text/plain');

    if (!url.pathname.startsWith(PREFIX)) {
      res.statusCode = 400;

      res.end('Please, start your path with <file>');

      return;
    }

    const filename = url.pathname.replace(PREFIX, '').slice(1) || 'index.html';
    const filePath = `${PUBLIC_FOLDER}/${filename}`;

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end("File doesn't exists");

      return;
    }

    const file = await fs.readFileSync(filePath, 'utf-8');

    res.statusCode = 200;
    res.end(file);
  });

  return server;
}

module.exports = {
  createServer,
};
