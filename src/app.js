'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  // Headers should be set before sending data
  res.setHeader('Content-Type', 'text/html');

  if (!req.url.startsWith('/file/')) {
    res.end('Please search for the files only in /file path');
  }

  const pathname = req.url.slice(5).replace(/\.\.\//g, '');

  fs.readFile(`./public/${pathname}`, (error, data) => {
    if (!error) {
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });
});

// Enables the server
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
