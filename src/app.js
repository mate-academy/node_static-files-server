/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs/promises');
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (normalizedUrl.pathname.startsWith('/file/')) {
    const urlElements = normalizedUrl.pathname.split('/file/')[1]
      || 'index.html';

    fs.readFile(`./public/${urlElements}`, 'utf-8')
      .then(data => res.end(data))
      .catch(() => {
        res.statusCode = 404;
        res.end();
      });
  } else {
    console.log('the pathname should start from "/file/..."');
  }
});

server.listen(8080, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
