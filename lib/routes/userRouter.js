'use strict';

const express = require('express');
const course = require('../models/course_schema');
const playlistModel = require('../models/playlist_schema');
const authorModel = require('../models/author_schema');
const moment = require('moment');
const getDuration = require('../utilities.js/getDuration');

const router = express.Router();
// const getUsername = require('../middlewares/username-finder.js');

// get the username from a middleware to create unique routes for each user
// router.param('user', getUsername);

router.post('/:user/course', (req, res) => {
  const { playlist, author, videos } = req.body;
  const newPlaylist = new playlistModel({
    url: playlist.url,
    playlist_title: playlist.playlist_title,
    description: playlist.description,
  });

  const totalDuration = getDuration(videos);

  const newAuther = new authorModel({
    name: author.name,
    channel_url: author.channel_url,
  });
  const newCourse = new course({
    playlist: newPlaylist,
    author: newAuther,
    toral_duration: totalDuration,
  });
  res.json(newCourse);
});

router.get('/:user/courses', getCoursesHandler);
router.get('/:user/courses/:Playlist', getPlaylistHandler);
router.put('/:user/courses/:Playlist', updatePlaylistHandler);
router.patch('/:user/courses/:Playlist', patchPlaylistHandler);
router.delete('/:user/courses/:Playlist', deletePlaylistHandler);

router.get('/:user/courses/:Playlist/:vidID', getVideoHandler);
router.patch('/:user/courses/:Playlist/:vidID/completed', CompletedHandler);
router.patch('/:user/courses/:Playlist/:vidID/notes', UpdateNoteHandler);
router.post('/:user/courses/:Playlist/:vidID/notes', postNoteHandler);
router.delete('/:user/courses/:Playlist/:vidID/notes', deleteNoteHandler);

function createCourseHandler(req, res) {}
function getCoursesHandler(req, res) {}
function getPlaylistHandler(req, res) {}
function updatePlaylistHandler(req, res) {}
function patchPlaylistHandler(req, res) {}
function deletePlaylistHandler(req, res) {}
function getVideoHandler(req, res) {}
function CompletedHandler(req, res) {}
function UpdateNoteHandler(req, res) {}
function postNoteHandler(req, res) {}
function deleteNoteHandler(req, res) {}

module.exports = router;
