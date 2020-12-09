const publicModel = require('../publicCourse_schema');
const courseModel = require('../course_schema');
const userModel = require('../user_schema');
require('express');
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

async function like(id, username) {
  // await publicModel.findOneAndUpdate(id )
  const publicCourse = await publicModel.findById(id);
  if (publicCourse.likes.includes(username)) {
    publicCourse.likes = publicCourse.likes.filter(item => item !== username);
  } else {
    publicCourse.likes.push(username);
  }
  const result = await publicModel.findOneAndUpdate(id, publicCourse, { new: true });
  return result;
}
module.exports = { getAllFromPublic, addCourseToUserList, getOnePublicCourse, like };
