const course = require('./course_schema');
const publicCourseModel = require('../models/publicCourse_schema');
const userModel = require('../models/user_schema');
const getDuration = require('../utilities.js/getDuration');
const { makeAuthor, makeSections, makePlaylist } = require('../utilities.js/common_create_logic');

async function createUserCourse(body) {
  try {
    const { playlist, author, sections, user } = body;
    const resultedUser = await userModel.findOne({ username: user });
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
      user: resultedUser._id,
    });
    return await newCourse.save();
  } catch (error) {
    console.log(error);
    return new Promise.reject('bad request');
  }
}

async function createPublicCourse(params) {
  try {
    const courseResult = await course.findById(params.course).select('-user');
    if (!courseResult) {
      return Promise.reject('404');
    }
    const { playlist, author, sections, total_duration } = courseResult;

    // create playlist and validate it
    const newPlaylist = await makePlaylist(playlist);
    await newPlaylist.validate();

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
        newSections[i].videos[j].isWatched = false;
        newSections[i].videos[j].note = '';
        await newSections[i].videos[j].validate();
      }
    }

    const newCourse = new publicCourseModel({
      playlist: newPlaylist,
      author: newAuther,
      total_duration,
      sections: newSections,
      publisher: params.user,
    });
    return await newCourse.save();
  } catch (error) {
    return new Promise.reject('bad request');
  }
}

module.exports = { createUserCourse, createPublicCourse };
