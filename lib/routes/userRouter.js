'use strict';

const express = require('express');
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

router.get('/:user/courses/:course/:vidID', bearerMW, getVideoHandler);
router.patch('/:user/courses/:course/:vidID/completed', bearerMW, CompletedHandler);
router.patch('/:user/courses/:course/:vidID/notes', bearerMW, UpdateNoteHandler);
router.post('/:user/courses/:course/:vidID/notes', bearerMW, postNoteHandler);
router.delete('/:user/courses/:course/:vidID/notes', bearerMW, deleteNoteHandler);

router.get('/secret', bearerMW, (req, res) => {
  res.status(200).json({ message: "it's working" });
});

// function createCourseHandler(req, res) {}
async function getCoursesHandler(req, res) {
  const result = await course.find({}).populate('user', 'username -_id');
  res.json(result);
}

async function getPlaylistHandler(req, res) {
  const result = await course.findById(req.params.course).select('-user');
  res.json(result);
}
function updatePlaylistHandler(req, res) {}
function patchPlaylistHandler(req, res) {}
function deletePlaylistHandler(req, res) {}
function getVideoHandler(req, res) {}
function CompletedHandler(req, res) {}
function UpdateNoteHandler(req, res) {}
function postNoteHandler(req, res) {}
function deleteNoteHandler(req, res) {}
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

module.exports = router;
