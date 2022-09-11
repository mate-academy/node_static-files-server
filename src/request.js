/* eslint-disable no-console */
'use strict'
const axios = require('axios');

axios.get('http://localhost:8080/file/index.html')
  .catch(() => console.log('Error'));
