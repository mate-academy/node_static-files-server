'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;
const FILE_PATH = '/file';

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

  const isFileRequested = normalizedUrl.pathname.includes(FILE_PATH);

  if (!isFileRequested) {
    res.statusCode = 500;

    res.write(`<h1>Please specify file name after path '${FILE_PATH}/'</h1>`);
    res.end();

    return;
  }

  let requestedFile = normalizedUrl.pathname.replace(`${FILE_PATH}/`, '');

  if (requestedFile.includes(FILE_PATH) || !requestedFile) {
    requestedFile = 'index.html';
  }

  fs.readFile(`./public/${requestedFile}`, (err, data) => {
    if (err) {
      res.statusCode = 404;

      res.write(`<h1>File not found</h1>`);
      res.end();

      return;
    }

    res.statusCode = 200;
    res.end(data);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Server is running on http://localhost:${PORT}`);
});
