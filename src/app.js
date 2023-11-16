'use strict';

const http = require('http');
const fs = require('fs/promises');
const { errorMessage } = require('./utils/errorMessage');

const POPT = 3001;
const EXPECTED_FOLDER = '/file';
const DATA_PATH = './public';
const DEFAULT_FILE = '/index.html';

const server = http.createServer(async(req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  const text = normalizedURL.pathname;

  res.setHeader('Content-Type', 'application/json');

  if (text.slice(0, EXPECTED_FOLDER.length) === EXPECTED_FOLDER) {
    let path = text.slice(EXPECTED_FOLDER.length);

    if (path === '' || path === '/') {
      path = DEFAULT_FILE;
    }

    try {
      const file = await fs.readFile(DATA_PATH + path);

      res.statusCode = 200;

      res.end(file);
    } catch (error) {
      res.statusCode = 400;

      res.end(errorMessage('Such files or directories do not exist'));
    }
  } else {
    res.statusCode = 400;

    res.end(
      errorMessage(
        'To successfully upload a file, use the path `/file` after the domain.'
      )
    );
  }
});

server.listen(POPT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started at port ${POPT}`);
});
