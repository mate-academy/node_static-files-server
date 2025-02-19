const { default: axios } = require('axios');

const PORT = 5701;
const HOST = `http://localhost:${PORT}`;

axios.get(`${HOST}/file/../app.js`);
