'use strict';

const fs = require('fs');
const path = require('path');
const { notFound } = require('../helpers/responses');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.txt': 'text/plain',
};

function fileOutput(res, filename) {
  const stream = fs.createReadStream(filename);

  stream.on('open', () => {
    const ext = path.extname(filename).toLowerCase();
    const contentType = mimeTypes[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(res);
  });

  stream.on('error', () => {
    if (res.headersSent) {
      return res.end();
    }
    notFound(res);
  });
}

module.exports = {
  fileOutput,
};
