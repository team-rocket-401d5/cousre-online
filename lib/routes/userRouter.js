'use strict';

const express = require('express');
const router = express.Router();

// const getUsername = require('../middlewares/username-finder.js');

// get the username from a middleware to create unique routes for each user
// router.param('user', getUsername);

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
