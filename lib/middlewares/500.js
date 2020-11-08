'use strict';

module.exports = (req, res, next) => {
  res.status(500);
  res.statusMessage = '500/Server Error ';
  res.json({ error: '500/Server Error ' });
};
