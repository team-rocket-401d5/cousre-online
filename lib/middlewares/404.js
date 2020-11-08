'use strict';

module.exports = (req, res, next) => {
  res.status(404);
  res.statusMessage = '404/Not Found';
  res.json({ error: '404/Not Found' });
};
