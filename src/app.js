/* eslint-disable no-console */
'use strict';

const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.end('Hello World');
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
