/* eslint-disable no-console */
const axios = require('axios');

axios
  .get('http://localhost:5701/file/../app.js')
  .then(() => console.log('200'))
  .catch((err) => console.log(err.response.status, err.response.statusText));
