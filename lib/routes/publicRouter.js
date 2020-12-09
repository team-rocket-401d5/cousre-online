'use strict';

const express = require('express');
const router = express.Router();
const bearerMW = require('../middlewares/Bearer.js');
const {
  getAllFromPublic,
  addCourseToUserList,
  getOnePublicCourse,
  like,
} = require('../models/collections/publicCollection');

router.get('/', getPublicCourses); // get all the public courses
router.post('/:id', bearerMW, addToCourses);
router.put('/like/:id', bearerMW, likePublicCourse);
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
      res.status(202).json(result);
    })
    .catch(error => {
      console.log(error);
      next();
    });
}
function getPublicCourse(req, res, next) {
  getOnePublicCourse(req.params.id)
    .then(result => {
      res.status(202).json(result);
    })
    .catch(error => {
      console.log(error);
      next();
    });
}

function likePublicCourse(req, res, next) {
  like(req.params.id, req.body.username)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(error);
      next();
    });
}

module.exports = router;
