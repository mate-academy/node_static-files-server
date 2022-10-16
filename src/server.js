/* eslint-disable no-console */
import http from 'http';
import fs from 'fs';
import url from 'url';

const PORT = process.env.port || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);

  if (!normalizedURL.pathname.startsWith('/file')) {
    res.end('Please add /file at the start of request');
  }

  let fileName = normalizedURL.pathname.replace('/file', '') || '/index.html';

  if (fileName === '/') {
    fileName = '/index.html';
  }

  fs.readFile(`./public${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end();
    }
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
