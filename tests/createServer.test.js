'use strict';
/* eslint-disable max-len */

const { Server } = require('http');
const { request } = require('../src/request');
const { createServer } = require('../src/createServer');
const chai = require('chai');
// eslint-disable-next-line no-shadow
const expect = chai.expect;

describe('createServer', () => {
  describe('basic scenarios', () => {
    it('should create a server', () => {
      expect(createServer)
        .to.be.an.instanceof(Function);
    });

    it('should create an instance of Server', () => {
      expect(createServer())
        .to.be.an.instanceof(Server);
    });
  });

  describe('Server', () => {
    let server;

    function listen(port) {
      return new Promise((resolve) => {
        server.listen(port, () => {
          resolve();
        });
      });
    }

    before(async() => {
      server = createServer();

      await listen(8080);
    });

    after(() => {
      server.close();
    });

    describe('Validation', () => {
      it('should throw correct error if path not starts with /file/', async() => {
        const {
          data,
          res,
        } = await request('/?toCase=SNAKE');

        expect(res.statusCode)
          .to.equal(400);

        expect(data)
          .to.equal('Wrong request format '
            + 'Correct request is: "/file/<PATH_TO_FILE OR FILE NAME>".');
      });

      it('should throw correct error if path not starts with /file/', async() => {
        const {
          data,
          res,
        } = await request('/pub/index.html');

        expect(res.statusCode)
          .to.equal(400);

        expect(data)
          .to.equal('Wrong request format '
            + 'Correct request is: "/file/<PATH_TO_FILE OR FILE NAME>".');
      });

      it('should throw correct error if file doesn\'t exist', async() => {
        const {
          data,
          res,
        } = await request('/file/public.html');

        expect(res.statusCode)
          .to.equal(404);

        expect(data)
          .to.equal('Not found');
      });

      describe('Response', () => {
        const cases = [
          '/file/index.html',
          '/file/styles/main.css',
        ];

        const response = [
          '<!DOCTYPE html>',
          '-webkit-text-size-adjust: 100%;',
        ];

        for (let i = 0; i < cases.length; i++) {
          it(`should convert url ${cases[i]} to an object`, async() => {
            const {
              data,
              res,
            } = await request(cases[i]);

            expect(res.statusCode)
              .to.equal(200);

            expect(data)
              .to.include(response[i]);
          });
        }
      });
    });
  });
});
