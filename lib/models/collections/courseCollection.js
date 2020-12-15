'use strict';
const courseModel = require('../course_schema.js');
const toSeconds = require('../../utilities.js/toSeconds.js');
const userModel = require('../user_schema.js');

class CourseCollection {
  constructor() {
    this.model = courseModel;
  }

  async readVideo(video_id, course1) {
    let videos;
    let result = await this.model.findById(course1);
    result.sections.forEach(item => {
      item.videos.forEach(video => {
        if (video.video_id === video_id) {
          videos = video;
        }
      });
    });
    return videos;
  }

  async updateisWatched(video_id, courseId) {
    let result = await this.model.find({ _id: courseId }).select('-_id');
    console.log(result);
    result[0].sections.forEach(item => {
      item.videos.forEach(video => {
        if (video.video_id === video_id) {
          if (video.isWatched) {
            video.isWatched = false;
            result[0].time_watched -= toSeconds(video.duration);
          } else {
            video.isWatched = true;
            result[0].time_watched += toSeconds(video.duration);
          }
        }
      });
    });
    let res = await this.model.update({ _id: courseId }, result[0], {
      new: true,
    });
    //  res=await res.save()
    return res;
  }
  async updateNote(video_id, courseId, note) {
    let result = await this.model.findOne({ _id: courseId });
    result.sections.forEach(item => {
      item.videos.forEach(video => {
        if (video.video_id === video_id) {
          video.note = note;
        }
      });
    });

    return this.model.update({ _id: courseId }, result, { new: true });
  }

  async readCourse(courseId, user) {
    //gets the sections of the playlist/course
    let userId = await userModel.findOne({ username: user }).select('_id');
    let result = await this.model.findOne({ _id: courseId, user: userId });
    return result;
  }
  async deleteCourse(courseId, user) {
    //gets the sections of the playlist/course
    let userId = await userModel.findOne({ username: user }).select('_id');
    let result = await this.model.findOneAndDelete({
      _id: courseId,
      user: userId,
    });
    return result;
  }
  async updateSections(courseId, user, newRec) {
    user = await userModel.findOne({ username: user });

    newRec.user = user._id;

    let result = await this.model.findOneAndUpdate({ _id: courseId, user: user._id }, newRec, {
      new: true,
    });
    return result;
  }
}

module.exports = new CourseCollection();
