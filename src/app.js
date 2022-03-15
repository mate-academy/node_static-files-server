'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
  const hint = fs.readFileSync(`./public/hint.html`);
  const initialLoadCheck = normalizedURL.pathname === '/';

  if (normalizedURL.pathname.split('/')[1] !== 'file' && !initialLoadCheck) {
    res.statusCode = 404;
    res.end(hint);

    return;
  }

  const fileName = normalizedURL.pathname.slice(6) || 'index.html';

  try {
    const data = fs.readFileSync(`./public/${fileName}`);

    res.end(data);

    return;
  } catch (error) {
    res.statusCode = 404;
    res.end(hint);
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
