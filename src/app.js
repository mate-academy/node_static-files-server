/* eslint-disable no-console */
'use strict';

const PORT = process.env.PORT || 5700;

const server = require('./server');

server()
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
