/* eslint-disable indent */
/* eslint-disable max-len */
'use strict';

const axios = require('axios');
const path = require('path');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { Server, Agent } = require('http');
const { createServer } = require('../src/createServer.js');

// this prevents `socket hang up` for Node.js 20.10+
axios.defaults.httpAgent = new Agent({ keepAlive: false });

const PORT = 5701;
const HOST = `http://localhost:${PORT}`;

function generateRandomCSS() {
  return `
    .${faker.lorem.word()} {
      color: ${faker.internet.color()};
      font-size: ${faker.number.int({
        min: 12, max: 24,
      })}px;
    }

    .${faker.lorem.word()} {
      background-color: ${faker.internet.color()};
      border: 2px solid ${faker.internet.color()};
      padding: ${faker.number.int({
        min: 5, max: 20,
      })}px;
    }
  `;
}

describe('Static files server', () => {
  describe('createServer', () => {
    describe('basic scenarios', () => {
      it('should create a server', () => {
        expect(createServer)
          .toBeInstanceOf(Function);
      });

      it('should create an instance of Server', async() => {
        expect(createServer())
          .toBeInstanceOf(Server);
      });
    });

    describe('Server', () => {
      let server;
      const publicFolderPath = path.resolve(__dirname, '../public');
      const stylesFolderPath = path.resolve(__dirname, '../public/styles');
      const indexFilePath = path.resolve(__dirname, '../public/index.html');
      const mainCSSFilePath = path.resolve(__dirname, '../public/styles/main.css');
      const randomCSSContent = generateRandomCSS();

      beforeAll(() => {
        fs.mkdirSync(publicFolderPath);

        fs.mkdirSync(stylesFolderPath);

        fs.writeFileSync(indexFilePath, '<!DOCTYPE html>');

        fs.writeFileSync(mainCSSFilePath, randomCSSContent);
      });

      beforeEach(() => {
        server = createServer();
        server.listen(PORT);
      });

      afterEach(() => {
        server.close();
      });

      afterAll(() => {
        if (fs.existsSync(indexFilePath)) {
          fs.rmdirSync(publicFolderPath, { recursive: true });
        }

        if (fs.existsSync(mainCSSFilePath)) {
          fs.rmdirSync(stylesFolderPath, { recursive: true });
        }
      });

      describe('Valid file requests', () => {
        it('should return the correct file for a valid path', async() => {
          const response = await axios.get(`${HOST}/file/index.html`);

          expect(response.status).toBe(200);
          expect(response.data).toContain('<!DOCTYPE html>');
        });

        it('should return the correct file for a valid subfolder path', async() => {
          const response = await axios.get(`${HOST}/file/styles/main.css`);

          expect(response.status).toBe(200);
          expect(response.data).toContain(randomCSSContent);
        });
      });

      describe('Non-existent file requests', () => {
        it('should return 404 for non-existent files', async() => {
          expect.assertions(3);

          try {
            await axios.get(`${HOST}/file/nonexistentfile.txt`);
          } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.headers['content-type']).toBe('text/plain');
            expect(error.response.data.length).toBeGreaterThan(0);
          }
        });
      });

      describe('Attempt to access files outside public folder', () => {
        it('should return 400 for traversal paths', async() => {
          expect.assertions(1);

          try {
            await axios.get(`${HOST}/file/../app.js`);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });

        it('should return 404 for paths having duplicated slashes', async() => {
          expect.assertions(1);

          try {
            await axios.get(`${HOST}/file//styles//main.css`);
          } catch (error) {
            expect(error.response.status).toBe(404);
          }
        });
      });

      describe('Other routes', () => {
        it('should return hint message for routes not starting with /file/', async() => {
          const response = await axios.get(`${HOST}/file`);

          expect(response.status).toBe(200);
          expect(response.headers['content-type']).toBe('text/plain');
          expect(response.data.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
