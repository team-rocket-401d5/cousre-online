'use strict';

const express = require('express');
const router = express.Router();
const course = require('../models/course_schema');
const publicCourseModel = require('../models/publicCourse_schema');
const playlistModel = require('../models/playlist_schema');
const authorModel = require('../models/author_schema');
const sectionModel = require('../models/section_schema');
const videoModel = require('../models/video_schema');
const getDuration = require('../utilities.js/getDuration');
const { createUserCourse, createPublicCourse } = require('../models/courses_creation_colection');
const router = express.Router();
const bearerMW = require('../middlewares/Bearer.js');
const video = require('../models/collections/courseCollection.js');



router.post('/:user/course', async (req, res) => {
  createUserCourse(req.body)
    .then(result => {
      console.log(result);
      res.json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json('Bad Request');
    });
});

router.get('/:user/courses', bearerMW, getCoursesHandler);
router.get('/:user/courses/:course', bearerMW, getPlaylistHandler);
router.post('/:user/courses/:course', bearerMW, publishCourseHandler);
router.put('/:user/courses/:course', bearerMW, updatePlaylistHandler);
router.patch('/:user/courses/:course', bearerMW, patchPlaylistHandler);
router.delete('/:user/courses/:course', bearerMW, deletePlaylistHandler);
router.get('/:user/courses/:course/:vidID', getVideoHandler); //put back the bearerMW ,
router.patch('/:user/courses/:course/:vidID/isWatched', updateIsWatchedHandler); //put back the bearerMW ,
router.patch('/:user/courses/:course/:vidID/notes', UpdateNoteHandler); //put back the bearerMW

router.get('/secret', bearerMW, (req, res) => {
  res.status(200).json({ message: "it's working" });
});


async function getVideoHandler(req, res, next) {
  const vidID = req.params.vidID;
  video
    .readVideo(vidID, req.params.course)
    .then((data) => {
      res.status(302).json(data);
    })
    .catch(next);
}

function updateIsWatchedHandler(req, res, next) {
  const vidID = req.params.vidID;

  console.log('params', req.params.course);
  video.updateisWatched(vidID, req.params.course).then((data) => {
    res.json(data); //redirect to router
  });
}



function createCourseHandler(req, res) {}

async function getCoursesHandler(req, res) {
  const result = await course.find({}).populate('user', 'username -_id');
  res.json(result);
}


//async function getPlaylistHandler(req, res) {
//  const result = await course.findById(req.params.course).select('-user');
//  res.json(result);
//}


async function publishCourseHandler(req, res) {
  createPublicCourse(req.params)
    .then(result => res.json(result))
    .catch(error => {
      console.log('meeeage', error);
      console.log('meeeage', error.message);
      if ('404' === error) res.status(404).json('course in not found');
      else res.status(400).json('Bad Request');
    });

function getPlaylistHandler(req, res,next) {
  const courseId = req.params.course;
  video.readPlaylist(courseId).then(data=>{
    res.json(data);
  });

}
function updatePlaylistHandler(req, res) {}
function patchPlaylistHandler(req, res) {}
function deletePlaylistHandler(req, res,next) {
  const courseId = req.params.course;
  video.deletePlaylist(courseId).then(data=>{
    res.json(data);
  });


}
// to delete the note req.body.note=""(clear)
function UpdateNoteHandler(req, res, next) {
  console.log('params', req.body.note);
  const vidID = req.params.vidID;

  video.updateNote(vidID, req.params.course, req.body.note).then((data) => {
    res.json(data);
  });
}




module.exports = router;
