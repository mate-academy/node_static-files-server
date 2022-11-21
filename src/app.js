'use strict';

const { createServer } = require('./createServer');

const PORT = process.env.port || 8080;

createServer()
  .listen(8080, () => {
    // eslint-disable-next-line no-console
    console.log('Server started! 🚀', PORT);
  });
