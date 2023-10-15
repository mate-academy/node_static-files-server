'use strict';

const path = require('path');

const handleFileRoute = (app) => {
  app.get('/file/*', (req, res) => {
    const requestedFilePath = req.params[0];

    if (requestedFilePath.includes('..')) {
      return res.status(404).send('File not found.');
    }

    const fullPath = path
      .join(__dirname, '..', 'public', requestedFilePath
        || 'index.html');

    res.sendFile(fullPath, err => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).send('File not found.');
        } else {
          console.error(err);

          return res.status(500).send('Internal Server Error.');
        }
      }
    });
  });
};

module.exports = handleFileRoute;
