'use strict';
const courseModel = require('../course_schema.js');
const toSeconds = require('../../utilities.js/toSeconds.js');

class CourseCollection {
  constructor() {
    this.model = courseModel;
  }

  async readVideo(video_id , course1) {
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
  async update(video_id,courseId) {
    let result = await this.model.findById(courseId);
    result.sections.forEach((item) => {
      item.videos.forEach((video) => {
        if (video.video_id === video_id) {
          video.isWatched=video.isWatched?false:true;
          if(video.isWatched){
            result.time_watched += toSeconds(video.duration);
          }else{
            result.time_watched -= toSeconds(video.duration);
          }
        }
      });
    });

    return this.model.findOneAndUpdate(courseId,result,{new:true});
    
  }
}

module.exports = new CourseCollection();
