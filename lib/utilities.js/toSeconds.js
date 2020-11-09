'use strict';

const moment = require('moment');

module.exports = (entry) => {
  let sec = 0;
  if (typeof entry === 'object') {
    entry.forEach((one) => {
      one.videos.forEach((item) => {
        if (item.duration.length < 5)
          sec = moment(item.duration, 'mm:ss').diff(
            moment().startOf('day'),
            'seconds',
          );
        else sec = moment.duration(item.duration).asSeconds();
      });
    });
  } else {
    if (entry.length < 5)
      sec = moment(entry, 'mm:ss').diff(moment().startOf('day'), 'seconds');
    else sec = moment.duration(entry).asSeconds();
  }

  return sec;
};
