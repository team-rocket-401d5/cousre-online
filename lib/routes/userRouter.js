'use strict';

const express = require('express');
const router = express.Router();
const bearerMW = require('../middlewares/Bearer.js');
// const getUsername = require('../middlewares/username-finder.js');

// get the username from a middleware to create unique routes for each user
// router.param('user', getUsername);

router.get('/:user/courses',bearerMW ,getCoursesHandler);
router.get('/:user/courses/:Playlist',bearerMW , getPlaylistHandler);
router.put('/:user/courses/:Playlist',bearerMW , updatePlaylistHandler);
router.patch('/:user/courses/:Playlist',bearerMW , patchPlaylistHandler);
router.delete('/:user/courses/:Playlist',bearerMW , deletePlaylistHandler);

router.get('/:user/courses/:Playlist/:vidID',bearerMW , getVideoHandler);
router.patch('/:user/courses/:Playlist/:vidID/completed',bearerMW , CompletedHandler);
router.patch('/:user/courses/:Playlist/:vidID/notes',bearerMW , UpdateNoteHandler);
router.post('/:user/courses/:Playlist/:vidID/notes',bearerMW , postNoteHandler);
router.delete('/:user/courses/:Playlist/:vidID/notes',bearerMW , deleteNoteHandler);

router.get('/secret',bearerMW,(req,res)=>{
  res.status(200).json({message: "it's working"});
})
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
