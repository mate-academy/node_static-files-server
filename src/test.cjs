'use strict';

const axios = require('axios');

const HOST = `http://localhost:${5701}`;

async function req() {
  const response = await axios.get(`${HOST}/file`);

  expect(response.status).toBe(200);
  expect(response.headers['content-type']).toBe('text/plain');
  expect(response.data.length).toBeGreaterThan(0);
}

req();
