/* eslint-disable no-console */
'use strict';

const { createServer } = require('./createServer');
const axios = require('axios');
const PORT = process.env.PORT || 5701;
const server = createServer();

axios
  .get(`http://localhost:${PORT}/file`)
  .then((response) => {
    console.log('Server responded:', response.data);
  })
  .catch((error) => {
    console.error('Error connecting to server:', error.message);
  });

server.listen(PORT);
