'use strict';

const server = require('../lib/server.js');
const supertest = require('supertest');
supertest(server);
require('@code-fellows/supergoose');
const users = require('../lib/models/collections/userCollection.js');
describe(' user  Model', () => {
  it('can generateToken() and  authenticateJWT a  user  ', async () => {
    jest.setTimeout(50000);
    const obj = {
      username: 'bayan34',
      password: '123',
    };

    const record = await users.save(obj);
    const recoed2 = await users.generateToken(record);
    const recoed3 = await users.authenticateJWT(recoed2);

   


    expect(recoed2).not.toEqual(undefined);
    expect(recoed3.username).toEqual('bayan34');
    
  });
  it('can save() a  user  ', async () => {
    jest.setTimeout(50000);
    const obj = {
      username: 'bayan3',
      password: '123',
    };

    const record = await users.save(obj);


    expect(record.username).toEqual('bayan3');
    expect(record.password).not.toEqual('bayan3');
  });

  it('can authenticateBasic() a  user  ', async () => {
    jest.setTimeout(50000);
    const obj = {
      username: 'bayan4',
      password: '123',
    };

    await users.save(obj);
    const record2 = await users.authenticateBasic('bayan4', '123');

    expect(record2.username).toEqual('bayan4');
    expect(record2.password).not.toEqual(undefined);
  });

  it('can list() a  user  ', async () => {
    jest.setTimeout(50000);
    const obj = {
      username: 'bayan5',
      password: '123',
  
    };

    await users.save(obj);

    const record3 = await users.list();



    expect(record3[0].username).toEqual('bayan34');
  });
});
