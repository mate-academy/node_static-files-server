'use strict';

const { createServer } = require('./modules/createServer');

const PORT = 8080;

createServer()
  .listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Server started! 🚀');
  });
