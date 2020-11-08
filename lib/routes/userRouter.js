'use strict';

const express = require('express');
const router = express.Router();
const { createUserCourse, createPublicCourse } = require('../models/courses_creation_colection');
const bearerMW = require('../middlewares/Bearer.js');
const video = require('../models/collections/courseCollection.js');
const courseModel = require('../models/collections/courseCollection.js');
const directCourseModel = require('../models/course_schema');
const userModel = require('../models/user_schema');

// tested munualy done
router.post('/:user/course', bearerMW, createCourseHandler); //user can add a new course.
// tested munualy done
router.get('/:user/courses', bearerMW, getCoursesHandler); //bearerMW, get all courses for specific for user
// tested munualy done
router.get('/:user/courses/:course', bearerMW, getOneCourseHandler); //bearerMW, get one course for specific for user
// tested munualy done
router.post('/:user/courses/:course', bearerMW, publishCourseHandler); // user can publish a new course in the public
// tested munualy done
router.put('/:user/courses/:course', bearerMW, updateCourseHandler); // user can reorganaize course
// tested munualy done
router.delete('/:user/courses/:course', bearerMW, deleteCourseHandler); // user can delete course
// tested munualy done
router.get('/:user/courses/:course/:vidID', bearerMW, getVideoHandler); // get specific video
// tested munualy done
router.patch('/:user/courses/:course/:vidID/isWatched', bearerMW, updateIsWatchedHandler); // can toggle video isWatched
// tested munualy done
router.patch('/:user/courses/:course/:vidID/notes', bearerMW, UpdateNoteHandler); // user can put notes

// router.get('/secret', bearerMW, (req, res) => {
//   res.status(201).json({ message: "it's working" });
// });

async function createCourseHandler(req, res) {
  createUserCourse(req.body)
    .then(result => {
 
      res.json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json('Bad Request');
    });
}
//router.put('/:user/courses/:course', updateCourseHandler);

function updateCourseHandler(req, res) {
  const { course, user } = req.params;

  courseModel.updateSections(course, user, req.body).then(data => {
    res.status(200).json(data);
  });
}

async function getVideoHandler(req, res, next) {
  const vidID = req.params.vidID;
  courseModel
    .readVideo(vidID, req.params.course)
    .then(data => {
      res.status(302).json(data);
    })
    .catch(next);
}
//router.patch('/:user/courses/:course/:vidID/isWatched', updateIsWatchedHandler); //put back the bearerMW ,

function updateIsWatchedHandler(req, res, next) {
  const vidID = req.params.vidID;


  courseModel.updateisWatched(vidID, req.params.course, req.params.user).then(data => {

    res.json(data); //redirect to router
  });
}

async function getCoursesHandler(req, res) {
  const resultedUser = await userModel.findOne({ username: req.params.user });

  const result = await directCourseModel
    .find({ user: resultedUser._id })
    .populate('user', 'username -_id');
  res.json(result);
}

async function publishCourseHandler(req, res) {
  createPublicCourse(req.params)
    .then(result => res.json(result))
    .catch(error => {
      console.log('meeeage', error);
      console.log('meeeage', error.message);
      if ('404' === error) res.status(404).json('course in not found');
      else res.status(400).json('Bad Request');
    });
}

function getOneCourseHandler(req, res, next) {
  const { course, user } = req.params;
  courseModel.readCourse(course, user).then(data => {
    res.json(data);
  });
}
function deleteCourseHandler(req, res, next) {
  const { course, user } = req.params;
  courseModel.deleteCourse(course, user).then(data => {
    res.json(data);
  });
}
// to delete the note req.body.note=""(clear)
function UpdateNoteHandler(req, res, next) {

  const vidID = req.params.vidID;
  courseModel.updateNote(vidID, req.params.course, req.body.note, req.body.user).then(data => {
    res.json(data);
  });
}

module.exports = router;
