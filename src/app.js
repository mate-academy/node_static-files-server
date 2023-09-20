'use strict';

const http = require('http');
const fs = require('fs');

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

    const fullPath = '.' + filePath.replace('file', 'public');

    if (!fs.existsSync(fullPath)) {
      throw new Error(WRONG_PATH_MESSAGE);
    }

    res.setHeader('Content-type', 'application/octet-stream');

    const fileStream = fs.createReadStream(fullPath);

    fileStream.pipe(res);
  } catch (err) {
    res.statusCode = 404;

    res.end(err.message);
  }
});

server.listen(PORT, () => {
  process.stdout.write(`Server is running on http://localhost:${PORT}\n`);
});
