/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

  const validPath = normalizedUrl.pathname.split('/')[1] === 'file';

  if (!validPath) {
    res.statusCode = 400;
    res.end('Path is not correct. Should be /file/<path>');
  } else {
    const fileName
      = normalizedUrl.pathname.split('/').slice(2).join('/') || 'index.html';

    const fileExtension = fileName.split('.').slice(-1);

    const mimeType = {
      html: 'text/html',
      css: 'text/css',
      js: 'text/javascript',
      jpg: 'image/jpeg',
      png: 'image/png',
      json: 'application/json',
      pdf: 'application/pdf',
      mp4: 'video/mp4',
      mp3: 'audio/mpeg',
    };

    if (!mimeType[fileExtension]) {
      res.statusCode = 400;
      res.end('File extension is not supported');
    }

    fs.readFile(`./public/${fileName}`, (error, data) => {
      if (error) {
        res.statusCode = 404;
      } else {
        res.setHeader('Content-Type', `${mimeType[fileExtension]}`);
        res.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
