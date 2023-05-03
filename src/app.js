'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const server = () => http.createServer(async(req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = normalizedUrl.pathname;
  const fileName = path.basename(pathname);
  const dirName = path.dirname(pathname);
  const fileExt = path.extname(pathname);

  if (fileName === 'file') {
    res.setHeader('Content-Type', 'text/html');

    try {
      const data = await fs.readFile('./public/index.html');

      res.statusCode = 200;
      res.statusText = 'OK';
      res.end(data);
    } catch (err) {
      res.statusCode = 404;
      res.statusText = 'Not Found';
      res.end();
    }

    return;
  }

  if (dirName.startsWith('/file')) {
    res.setHeader('Content-Type', `text/${fileExt.slice(1)}`);

    const normalizedDirname = dirName.replace('/file', '/public');

    try {
      const data = await fs.readFile(`.${normalizedDirname}/${fileName}`);

      res.statusCode = 200;
      res.statusText = 'OK';
      res.end(data);
    } catch (err) {
      res.statusCode = 404;
      res.statusText = 'Not Found';

      res.end('There is no such file on the server.');
    }

    return;
  }

  res.statusCode = 404;

  res.end('The path must contain "/file/" directory and the file name.'
    + '\n' + 'Example: "/file/index.html" or "/file/styles/main.css".');
});

server().listen(3000);
