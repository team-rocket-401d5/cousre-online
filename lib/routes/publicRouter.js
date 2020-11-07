'use strict';

const express = require('express');
const router = express.Router();
const {
  getAllFromPublic,
  addCourseToUserList,
  getOnePublicCourse,
} = require('../models/collections/publicCollection');

router.get('/', getPublicCourses);

router.post('/addtocourse/:id', addToCourses);
router.get('/:id', getPublicCourse);

function getPublicCourses(req, res, next) {
  getAllFromPublic()
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.log(error);
      next();
    });
}
function addToCourses(req, res, next) {
  addCourseToUserList(req.params.id, req.body.username)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.log(error);
      next();
    });
}
function getPublicCourse(req, res, next) {
  getOnePublicCourse(req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.log(error);
      next();
    });
}

module.exports = router;
