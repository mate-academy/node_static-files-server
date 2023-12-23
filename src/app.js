'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://localhost:${PORT}`);
  const pathName = normalizedURL.pathname;

  if (!pathName.includes('/file')) {
    res.end(`Your request doesn't start with "/file".
      Correct request is: "/file/...PATH_TO_FILE"`);
  } else {
    let filePath = pathName.replace('/file', './public');

    if (filePath === './public' || filePath === './public/') {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (!err) {
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end('File does not exist');
      }
    });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
