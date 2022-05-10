'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  const parts = normalizedURL.pathname;

  if (!parts.startsWith('/file')) {
    res.statusCode = 404;

    return res.end('To access files on server write /file/ on url start \r\n');
  }

  const fileName = parts.replace('/file', '').slice(1) || 'index.html';
  const filePath = `public/${fileName}`;

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.write('Page not found');
    } else {
      res.write(data, 'utf8');
    }
    res.end();
  });
});

// Enables the server
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
