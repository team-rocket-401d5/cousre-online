'use strict';

module.exports = durationFromApi => {
  const result = durationFromApi
    .slice(2)
    .split('')
    .map(item => {
      if (item.match(/[a-z]/gi)) item = ':';

      return item;
    });
  result.pop();

  return result.join('');
};
