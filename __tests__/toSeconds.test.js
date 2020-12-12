
const test2 = require('../lib/utilities.js/toSeconds.js');
describe('api server', () => {
  it('should respond with 500 on an error', () => {
    let time = test2('1');
    console.log('vvv', time);
    expect(time).toBe(60);
  });
});
