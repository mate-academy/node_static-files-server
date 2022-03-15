'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const er = './src/public/error.html';
const help = './src/public/help.html';
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  function createPage(params) {
    fs.readFile(`${params}`, (error, data) => {
      if (!error) {
        res.end(data);
      }
      res.statusCode = 404;

      fs.readFile(`${er}`, (err, dat) => {
        res.end(dat);

        if (err) {
          // eslint-disable-next-line no-console
          console.log('error'); ;
        }
      });
    });
  }

  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const pathStart = normalizedURL.pathname.split('/')[1];
  const pathURL = normalizedURL.pathname.split('/').slice(1);

  const fileBasic = path.join(__dirname, 'public', req.url === '/'
    ? 'index.html'
    : req.url);

  createPage(fileBasic);

  if (pathStart !== 'file') {
    createPage(help);
  } else {
    const temp = normalizedURL.pathname.split('/').slice(2).join('/');
    const codPath = `./src/public/${temp}`;

    createPage(codPath);
  }

  if ((pathURL.length === 1 || 2) && pathURL.join('') === 'file') {
    createPage(`./src/public/index.html`);
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
