'use strict';
const courseModel = require('../course_schema.js');
const toSeconds = require('../../utilities.js/toSeconds.js');

class CourseCollection {
  constructor() {
    this.model = courseModel;
  }

  async readVideo(video_id, course1) {
    let videos;
    let result = await this.model.findById(course1);
    result.sections.forEach((item) => {
      item.videos.forEach((video) => {
        if (video.video_id === video_id) {
          videos = video;
        }
      });
    });
    return videos;
  }
  async updateisWatched(video_id, courseId) {
    let result = await this.model.findById(courseId);
    result.sections.forEach((item) => {
      item.videos.forEach((video) => {
        if (video.video_id === video_id) {
          video.isWatched = video.isWatched ? false : true;
          if (video.isWatched) {
            result.time_watched += toSeconds(video.duration);
          } else {
            result.time_watched -= toSeconds(video.duration);
          }
        }
      });
    });

    return this.model.findOneAndUpdate(courseId, result, { new: true });
  }
  async updateNote(video_id, courseId, note) {
    let result = await this.model.findById(courseId);
    result.sections.forEach((item) => {
      item.videos.forEach((video) => {
        if (video.video_id === video_id) {
          video.note = note;
        }
      });
    });

    return this.model.findOneAndUpdate(courseId, result, { new: true });
  }

  async readPlaylist(playlist_id) {
    //gets the sections of the playlist/course
    let result = await this.model.findById(playlist_id);
    return result.sections;
  }
  async deletePlaylist(playlist_id) {
    //gets the sections of the playlist/course
    let result = await this.model.findOneAndDelete({'_id':playlist_id});
    return result;
  }
}

module.exports = new CourseCollection();
