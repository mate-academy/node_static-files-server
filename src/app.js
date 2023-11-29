/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs/promises');
const { generateFilePath } = require('./helpers/generateFilePath');

const PORT = process.env.PORT || 3003;

const server = http.createServer(async(req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(204, { 'Content-Type': 'image/x-icon' });
    res.end();

    return;
  }

  const reqPath = req.url;

  if (!reqPath.startsWith('/file')) {
    res.setHeader('Content-Type', 'application/json');

    const payload = {
      message: 'The path should start with /file/',
    };

    res.end(JSON.stringify(payload, null, 2));

    return;
  }

  const filePath = generateFilePath(reqPath);

  try {
    const file = await fs.readFile(filePath, 'utf8');

    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else {
      res.setHeader('Content-Type', 'text/plain');
    }

    res.statusCode = 200;

    res.end(file);
  } catch (e) {
    res.statusCode = 404;

    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
