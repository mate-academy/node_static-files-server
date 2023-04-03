/* eslint-disable no-console */
'use strict';

const { server } = require('./server');

const BASE = 'http://localhost';
const PORT = process.env.PORT || 3040;

server.listen(PORT, () => {
  console.log(`Server is running on ${BASE}:${PORT}\n`);
});
