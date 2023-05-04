'use strict';

const express = require('express');
const path = require('node:path');
const fs = require('node:fs');

const app = express();

const PORT = 5000;

const PUBLIC_PATH = path.join(__dirname, '..', 'public');

app.get('/file/*', (req, res) => {
  const params = req.params[0];
  const filePath = path.join(PUBLIC_PATH, params);
  const relativePath = path.relative(PUBLIC_PATH, filePath);

  if (relativePath.startsWith('..')) {
    return res.sendStatus(403);
  }

  if (!fs.existsSync(filePath)) {
    res.sendStatus(404);
  }

  res.sendFile(filePath);
});

app.get('*', (req, res) => {
  const errorPagePath = path.join(PUBLIC_PATH, 'errorPage/errorPage.html');

  res.status(403);
  res.sendFile(errorPagePath);
});

app.listen(PORT, () => {
  global.console.log(`Server is launched in port: ${PORT}`);
});
