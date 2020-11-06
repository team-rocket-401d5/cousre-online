const moment = require('moment');

module.exports = entry => {
  let sum = 0;
  if (typeof entry === 'object') {
    entry.forEach(one => {
      one.items.forEach(item => {
        if (item.duration.length < 5)
          sum += moment(item.duration, 'mm:ss').diff(moment().startOf('day'), 'seconds');
        else sum += moment.duration(item.duration).asSeconds();
      });
    });
  } else {
    if (entry.length < 5) sum += moment(entry, 'mm:ss').diff(moment().startOf('day'), 'seconds');
    else sum += moment.duration(entry).asSeconds();
  }

  return sum;
};
