'use strict';

const express = require('express');
const router = express.Router();
const {
  createUserCourse,
  createPublicCourse,
} = require('../models/courses_creation_colection');
const bearerMW = require('../middlewares/Bearer.js');
const courseModel = require('../models/collections/courseCollection.js');

router.post('/:user/course', createCourseHandler);//user can add a new course.
router.get('/:user/courses',  getCoursesHandler);//bearerMW,
router.get('/:user/courses/:course',  getCourseHandler);//bearerMW,
router.post('/:user/courses/:course', publishCourseHandler);
router.put('/:user/courses/:course', updateCourseHandler);
router.delete('/:user/courses/:course', deleteCourseHandler);
router.get('/:user/courses/:course/:vidID', getVideoHandler); //put back the bearerMW ,
router.patch('/:user/courses/:course/:vidID/isWatched', updateIsWatchedHandler); //put back the bearerMW ,
router.patch('/:user/courses/:course/:vidID/notes', UpdateNoteHandler); //put back the bearerMW

router.get('/secret', bearerMW, (req, res) => {
  res.status(200).json({ message: "it's working" });
});

async function createCourseHandler(req, res) {
createUserCourse(req.body)
  .then((result) => {
    console.log(result);
    res.json(result);
  })
  .catch((error) => {
    console.log(error);
    res.status(400).json('Bad Request');
  });
}
//router.put('/:user/courses/:course', updateCourseHandler);

function updateCourseHandler(req, res) {
  const {course , user } = req.params;

  courseModel.updateSections(course,user,req.body).then((data)=>{
    res.status(200).json(data);
  })
  
}

async function getVideoHandler(req, res, next) {
  const vidID = req.params.vidID;
  courseModel
    .readVideo(vidID, req.params.course)
    .then((data) => {
      res.status(302).json(data);
    })
    .catch(next);
}
//router.patch('/:user/courses/:course/:vidID/isWatched', updateIsWatchedHandler); //put back the bearerMW ,

function updateIsWatchedHandler(req, res, next) {
  const vidID = req.params.vidID;
  console.log('params', req.params.course,req.params.user);
  courseModel.updateisWatched(vidID, req.params.course,req.params.user).then((data) => {
    res.json(data); //redirect to router
  });
}

async function getCoursesHandler(req, res) {
  const result = await courseModel.find({}).populate('user', 'username -_id');
  res.json(result);
}

//async function getCourseHandler(req, res) {
//  const result = await course.findById(req.params.course).select('-user');
//  res.json(result);
//}

async function publishCourseHandler(req, res) {
  createPublicCourse(req.params)
    .then((result) => res.json(result))
    .catch((error) => {
      console.log('meeeage', error);
      console.log('meeeage', error.message);
      if ('404' === error) res.status(404).json('course in not found');
      else res.status(400).json('Bad Request');
    });
}

function getCourseHandler(req, res, next) {
  const {course,user} = req.params;
  courseModel.readCourse(course,user).then((data) => {
    res.json(data);
  });
}
function deleteCourseHandler(req, res, next) {
  const {course,user} = req.params;
  courseModel.deleteCourse(course,user).then((data) => {
    res.json(data);
  });
}
// to delete the note req.body.note=""(clear)
function UpdateNoteHandler(req, res, next) {
  console.log('params', req.body.note);
  const vidID = req.params.vidID;

  courseModel.updateNote(vidID, req.params.course, req.body.note,req.body.user).then((data) => {
    res.json(data);
  });
}

module.exports = router;
