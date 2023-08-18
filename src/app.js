'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
// eslint-disable-next-line max-len
const WRONG_PATH_MESSAGE = 'No such file or path to file is invalid. Path shoud start with "/file" and relative path.';

const server = http.createServer((req, res) => {
  let filePath = req.url;

  if (filePath.endsWith('/')) {
    filePath = filePath.slice(0, -1);
  }

  if (filePath === '/file') {
    filePath += '/index.html';
  }

  try {
    if (!filePath.startsWith('/file')) {
      throw new Error(WRONG_PATH_MESSAGE);
    }

    const fullPath = path
      .join(__dirname, '..', filePath.replace('file', 'public'));

    if (!fs.existsSync(fullPath)) {
      throw new Error(WRONG_PATH_MESSAGE);
    }

    res.headers = {
      'Content-type': 'file',
    };

    const fullPathSecured = new url.URL(fullPath, `http://${req.headers.host}`);

    const fileStream = fs.createReadStream(fullPathSecured.href);

    fileStream.pipe(res);
  } catch (err) {
    res.statusCode = 404;

    res.end(err.message);
  }
});

server.listen(PORT, () => {
  process.stdout.write(`Server is running on http://localhost:${PORT}\n`);
});
