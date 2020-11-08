const publicModel = require('../publicCourse_schema');
const courseModel = require('../course_schema');
const userModel = require('../user_schema');
const { json } = require('express');
async function getAllFromPublic() {
  const result = await publicModel.find({});
  console.log(result);

  return result;
}

async function addCourseToUserList(courseId, user) {
  console.log('courseIdcourseId', courseId);
  let resultFromPublic = await publicModel
    .findOne({ _id: courseId })
    .select('-publisher -__v -_id');
  const resultedUser = await userModel.findOne({ username: user });

  resultFromPublic = JSON.parse(JSON.stringify(resultFromPublic));
  console.log(resultFromPublic);
  resultFromPublic['user'] = resultedUser._id;

  const newUserCourse = new courseModel(resultFromPublic);

  return await newUserCourse.save();
}

async function getOnePublicCourse(courseId) {
  const resultCourse = await publicModel.findById(courseId);
  console.log('__resultCourse__', resultCourse);
  return resultCourse;
}

module.exports = { getAllFromPublic, addCourseToUserList, getOnePublicCourse };
