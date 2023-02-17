'use strict';
/* eslint-disable no-console */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const PORT = 3000;

const server = http.createServer((req, res) => {
  const normalizeURL = new URL(req.url, `http://${req.headers.host}`);

  const parts = normalizeURL.pathname.slice(1).split('/');

  if (parts[0] !== 'file') {
    console.log('Write a correct address. Exp: /file/styles/main.css');
  }

  if (parts.length === 1) {
    parts.push('index.html');
  }

  parts[0] = 'public';

  const correctPath = parts.join('/');

  (async() => {
    try {
      const fileData = await fs.readFile(
        path.join(__dirname, '../', correctPath), 'utf-8');

      res.setHeader('Content-Type', 'application/json');

      res.end(JSON.stringify({
        fileData,
      }));
    } catch (e) {
      res.statusCode = 404;
      res.statusMessage = 'Non existent file';
      res.end();
    }
  })();
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server started! 🚀');
});
