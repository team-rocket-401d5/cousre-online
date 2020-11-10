const moment = require('moment');

const test3 = require('../lib/utilities.js/getDuration.js');
describe('api server', () => {
  it('should respond with 500 on an error', () => {
    let time = test3('1');
    console.log('vvv', time);
    expect(time).toBe(60);
  });
});
