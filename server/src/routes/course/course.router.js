const express = require('express');
const { errHandler } = require('../../middleware/errorMiddleware');
const {
  httpFindCourses,
  httpFindCourseById,
  httpCreateCourse,
  httpUpdateCourse,
  httpDeleteCourse,
} = require('./course.controller');

const courseRouter = express.Router();

courseRouter.get('/', errHandler(httpFindCourses));
courseRouter.post('/', errHandler(httpCreateCourse));
courseRouter.put('/:id', errHandler(httpUpdateCourse));
courseRouter.delete('/:id', errHandler(httpDeleteCourse));
courseRouter.get('/:id', errHandler(httpFindCourseById));

module.exports = courseRouter;
