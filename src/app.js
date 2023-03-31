'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const filePath = normalizedURL.pathname.slice(1);

  if (!filePath.startsWith('file')) {
    res.end('Error! Path to the files should begin with /file/... '
      + 'Insert it before the path to your directory');
  };

  let modifiedFilePath = filePath.replace('file', '');

  if (modifiedFilePath.length <= 1) {
    modifiedFilePath = 'index.html';
  }

  fs.readFile(`src/public/${modifiedFilePath}`, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Error 404 occurred. Check address in URL');
    }
    res.end(data);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
