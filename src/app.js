'use strict';
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const http = require('http');
const { pipeline } = require('stream');
const { getContentType } = require('./utils/getContentType');
const { sendResError } = require('./utils/sendResError');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const [pathNameFile, ...pathNames] = req.url.split('/').filter(i => i);
  let pathResponseFile;

  if (!pathNameFile || pathNameFile !== 'file') {
    sendResError(res, 'url string should contain \'file\'');

    return;
  }

  if (pathNames.length === 0) {
    pathResponseFile = path.join('public', 'index.html');
  } else {
    pathResponseFile = path.join('public', ...pathNames);
  }

  if (!fs.existsSync(pathResponseFile)) {
    sendResError(res, 'file not exists');

    return;
  }

  const file = fs.createReadStream(pathResponseFile);
  const extentionFile = pathResponseFile.split('.').pop();

  res.setHeader('Content-Type', getContentType(extentionFile));

  pipeline(file, res, () => {
    sendResError(res, 'something went wrong', 500);
  });

  file.on('error', () => {
    sendResError(res, 'something went wrong', 500);
  });

  file.on('close', () => {
    file.destroy();
  });
});

server.listen(PORT);
