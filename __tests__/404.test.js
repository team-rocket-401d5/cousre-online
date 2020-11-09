'use strict';
const { server } = require('../lib/server.js');
const supertest = require('supertest');
const mockRequest = supertest(server);
describe('api server', () => {
  it('should respond with 404 on an error on undefined routes', async () => {
    await mockRequest.get('/foo').then((results) => {
      expect(results.status).toBe(404);
    });
  });
});
