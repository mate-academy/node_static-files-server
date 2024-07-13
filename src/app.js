/* eslint-disable no-console */
'use strict';

const { createServer, PORT } = require('./createServer');

createServer().listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
  console.log(`Available at http://localhost:${PORT}`);
});
