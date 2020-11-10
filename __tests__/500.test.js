'use strict';
const { server } = require('../lib/server.js');
const supertest = require('supertest');
const mockRequest = supertest(server);
describe('api server', () => {
  it('should respond with 500 on an error', async () => {
    await mockRequest.get('/bad').then((results) => {
      // console.log(results.req)
      expect(results.status).toBe(500);
      // expect(results.req).toBe('Internal Server Error');

    });
  });
});
