const publicModel = require('../publicCourse_schema');
const courseModel = require('../course_schema');
const userModel = require('../user_schema');
const { json } = require('express');
async function getAllFromPublic() {
  const result = await publicModel.find({});


  return result;
}

async function addCourseToUserList(courseId, user) {
 
  let resultFromPublic = await publicModel
    .findOne({ _id: courseId })
    .select('-publisher -__v -_id');
  const resultedUser = await userModel.findOne({ username: user });

  resultFromPublic = JSON.parse(JSON.stringify(resultFromPublic));

  resultFromPublic['user'] = resultedUser._id;

  const newUserCourse = new courseModel(resultFromPublic);

  return await newUserCourse.save();
}

async function getOnePublicCourse(courseId) {
  const resultCourse = await publicModel.findById(courseId);

  return resultCourse;
}

module.exports = { getAllFromPublic, addCourseToUserList, getOnePublicCourse };
