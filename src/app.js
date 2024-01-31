/* eslint-disable no-console */
'use strict';

const { createServer } = require('./createServer');
const PORT = require('./PORT');

createServer().listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
  console.log(`Available at http://localhost:${PORT}`);
});

module.exports = {
  PORT,
};
