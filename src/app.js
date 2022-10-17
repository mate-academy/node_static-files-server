/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.port || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
  const myURL = normalizedURL.pathname.slice(1) || 'index.html';

  if (myURL.includes('file')) {
    fs.readFile(`./src/public/${myURL.replace('file/', '')}`, (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 404;

        res.end();
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else {
    console.log('Error: write /file/<YOUR_FILE>');
  }
});

server.listen(PORT, () => {
  console.log('Server is running');
});
