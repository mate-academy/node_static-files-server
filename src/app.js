'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const isCorrectPath = req.url.startsWith('/file');

  if (!isCorrectPath) {
    res.end('The pathname should start with /file');
  }

  const pathToFile = req.url
    .slice(1)
    .split('/')
    .slice(1)
    .join('/')
  || 'index.html';

  const absPathToFile = path.join(__dirname, `/public/${pathToFile}`);

  try {
    const data = fs.readFileSync(absPathToFile, 'utf-8');

    res.end(data);
  } catch (e) {
    res.statusCode = 404;
    res.end(`The file does not exist`);
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
