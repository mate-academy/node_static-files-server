'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.port || 8080;

const server = http.createServer((req, res) => {
  let fileName = req.url.slice(1);

  if (fileName.includes('/') || fileName.length < 1) {
    fileName = 'file/index.html';
  }

  const checkParth = fileName.split('/')[0];

  // eslint-disable-next-line no-console
  console.log(fileName);

  if (!checkParth.includes('file')) {
    res.end('Sample: "html://localhost:8080/file/index.html"');
  } else {
    fileName = fileName.split('/').slice(1).join('/') || 'index.html';

    fs.readFile(`./public/${fileName}`, (error, data) => {
      if (!error) {
        res.end(data);
      } else {
        res.statusCode = 404;

        res.end('Error code 404!!!');
      }
    });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
