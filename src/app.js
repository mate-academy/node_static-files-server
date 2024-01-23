/* eslint-disable max-len */
'use strict';

const fs = require('fs');
const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, BASE_URL);

  if (!normalizedUrl.pathname.startsWith('/file')) {
    return res.end(`Enter the correct path.\n Example: ${BASE_URL}/file/index.html`);
  }

  let filePath = 'index.html';

  if (normalizedUrl.pathname.includes('/file/')) {
    const filePathCutted = normalizedUrl.pathname.split('/file/').slice(1)[0];

    if (filePathCutted) {
      filePath = filePathCutted;
    }
  }

  fs.readFile(`../public/${filePath}`, (err, data) => {
    if (!err) {
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running...');
});
