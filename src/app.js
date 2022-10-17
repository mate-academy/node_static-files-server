'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedURl = new URL(req.url, `http://${req.headers.host}`);

  if (!(normalizedURl.pathname.startsWith('/file'))) {
    res.end('Please add "/file" at the start of your url request');
  }

  const correctPath = normalizedURl.pathname.replace('/file', '')
    || 'index.html';

  fs.readFile(`./public/${correctPath}`, (err, data) => {
    if (!err) {
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
