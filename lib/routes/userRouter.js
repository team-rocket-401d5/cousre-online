'use strict';

const express = require('express');
const router = express.Router();
const course = require('../models/course_schema');
const playlistModel = require('../models/playlist_schema');
const authorModel = require('../models/author_schema');
const sectionModel = require('../models/section_schema');
const videoModel = require('../models/video_schema');
const getDuration = require('../utilities.js/getDuration');
const bearerMW = require('../middlewares/Bearer.js');
const video = require('../models/collections/videoCollection.js');

router.get('/:user/courses', bearerMW, getCoursesHandler);
router.get('/:user/courses/:Playlist', bearerMW, getPlaylistHandler);
router.put('/:user/courses/:Playlist', bearerMW, updatePlaylistHandler);
router.patch('/:user/courses/:Playlist', bearerMW, patchPlaylistHandler);
router.delete('/:user/courses/:Playlist', bearerMW, deletePlaylistHandler);

router.get('/:user/courses/:course/:vidID', getVideoHandler); //put back the bearerMW ,

router.patch('/:user/courses/:course/:vidID/isWatched',updateIsWatchedHandler); //put back the bearerMW ,
router.patch('/:user/courses/:course/:vidID/notes', UpdateNoteHandler);//put back the bearerMW 

async function getVideoHandler(req, res, next) {
  const vidID = req.params.vidID;
  video
    .readVideo(vidID, req.params.course)
    .then((data) => {
      res.status(302).json(data);
    })
    .catch(next);
}

function updateIsWatchedHandler(req, res,next) {
  const vidID = req.params.vidID;

  console.log("params",req.params.course);
  video
  .update(vidID, req.params.course)
  .then((data) => {
    res.json(data); //redirect to router
  });
}
function UpdateNoteHandler(req, res) {}
function postNoteHandler(req, res) {}
function deleteNoteHandler(req, res) {}

router.post('/:user/course', async (req, res) => {
  try {
    const { playlist, author, sections, user } = req.body;
    // create playlist and validate it
    console.log('sectionssssss', sections);
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
    console.log(error);
    res.status(400).json('Bad Request');
  }
});

router.get('/secret', bearerMW, (req, res) => {
  res.status(200).json({ message: "it's working" });
});
function getCoursesHandler(req, res) {}

function makeSections(sections) {
  return sections.map((section) => {
    {
      const newVideos = section.videos.map(makeVideos);
      // console.log('__videos__', newVideos);
      section.section_title;
      return new sectionModel({
        section_title: section.section_title,
        videos: newVideos,
      });
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
