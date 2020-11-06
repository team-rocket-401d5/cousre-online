'use strict';

const express = require('express');
const course = require('../models/course_schema');
const playlistModel = require('../models/playlist_schema');
const authorModel = require('../models/author_schema');
const sectionModel = require('../models/section_schema');
const videoModel = require('../models/video_schema');
const moment = require('moment');
const getDuration = require('../utilities.js/getDuration');

const router = express.Router();
// const getUsername = require('../middlewares/username-finder.js');

// get the username from a middleware to create unique routes for each user
// router.param('user', getUsername);

router.post('/:user/course', async (req, res) => {
  try {
    const { playlist, author, sections, user } = req.body;
    // create playlist and validate it
    const newPlaylist = await makePlaylist(playlist);
    await newPlaylist.validate();

    const totalDuration = getDuration(sections);
    // create author and validate it
    const newAuther = makeAuthor(author);
    await newAuther.validate();
    // create sections and validate it
    const newSections = await makeSections(sections);
    for (let i = 0; i < newSections.length; i++) {
      await newSections[i].validate();
    }
    for (let i = 0; i < newSections.length; i++) {
      for (let j = 0; j < newSections[i].videos.length; j++) {
        await newSections[i].videos[j].validate();
      }
    }

    const newCourse = new course({
      playlist: newPlaylist,
      author: newAuther,
      total_duration: totalDuration,
      sections: newSections,
      user: user,
    });
    const result = await newCourse.save();
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(400).json('Bad Request');
  }
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

function makeSections(sections) {
  return sections.map(section => {
    {
      const newVideos = section.videos.map(makeVideos);
      // console.log('__videos__', newVideos);
      section.section_title;
      return new sectionModel({ section_title: section.section_title, videos: newVideos });
    }
  });
}
function makeVideos(video) {
  return new videoModel({
    url_simple: video.url_simple,
    title: video.title,
    thumbnail: video.thumbnail,
    duration: video.duration,
    video_id: video.video_id,
  });
}

function makeAuthor(author) {
  return new authorModel({
    name: author.name,
    channel_url: author.channel_url,
  });
}

function createCourseHandler(req, res) {}
async function getCoursesHandler(req, res) {
  console.log('hi');
  // const result = await course.populate('user', 'username -_id').find({});
  const result = await course.find({}).populate('user', 'username -_id');
  res.json(result);
}
function getPlaylistHandler(req, res) {}
function updatePlaylistHandler(req, res) {}
function patchPlaylistHandler(req, res) {}
function deletePlaylistHandler(req, res) {}
function getVideoHandler(req, res) {}
function CompletedHandler(req, res) {}
function UpdateNoteHandler(req, res) {}
function postNoteHandler(req, res) {}
function deleteNoteHandler(req, res) {}

async function makePlaylist(playlist) {
  playlist = new playlistModel({
    url: playlist.url,
    playlist_title: playlist.playlist_title,
    description: playlist.description,
    total_items: playlist.total_items,
  });

  return playlist;
}

module.exports = router;
