/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    const url = req.url;

    console.log(req.url);

    if (!url.startsWith('/file/')) {
      res.writeHead(200, { 'Content-type': 'text/plain' });
      res.end('start your url with /file and will has continue after file/..');

      return;
    }

    if (url.includes('../')) {
      res.writeHead(400, { 'Content-type': 'text/plain' });
      res.end('your url have not to have ../');

      return;
    }

    if (url.includes('//')) {
      res.writeHead(404, { 'Content-type': 'text/plain' });
      res.end('your url have not to have //');

      return;
    }

    let urlName = url.slice(6);
    const pathPublic = path.resolve(__dirname, '../public');

    if (urlName.length < 1) {
      urlName = 'index.html';
    }

    const newUrl = path.join(pathPublic, urlName);

    if (fs.existsSync(newUrl)) {
      const myFile = fs.readFileSync(newUrl);
      const type = path.extname(newUrl).slice(1);

      res.writeHead(200, { 'Content-type': `text/${type}` });
      res.end(myFile);

      return;
    }

    res.writeHead(404, { 'Content-type': 'text/plain' });
    res.end('File not found');
  });

  return server;
}

module.exports = {
  createServer,
};
