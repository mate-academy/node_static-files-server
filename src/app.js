/* eslint-disable no-console */
'use strict';

const express = require('express');
const handleFileRoute = require('./fileRoute');
const app = express();
const port = 3000;

handleFileRoute(app);

app.get('*', (req, res) => {
  res.status(400).send('To load files, use the path starting with /file/');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
