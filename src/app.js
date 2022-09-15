'use strict';

const { readFile } = require('fs');
const http = require('http');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (!(pathname.startsWith('/file'))) {
    res.end('Path to file must begin with "/file/"!');
  } else {
    const filename = pathname.replace('/file', '') || '/index.html';

    readFile(`./public${filename}`, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end();
      } else {
        res.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
