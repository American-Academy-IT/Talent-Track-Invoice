const { validateCourse } = require('@invoice-system/shared');
const {
  findCourses,
  createCourse,
  findCourseByID,
  findCourseByName,
  getCoursesList,
  updateCourse,
  deleteCourse,
} = require('../../datastore/models/course');

async function httpFindCourses(req, res) {
  const { search } = req.query;
  if (search) {
    return res.status(200).send(await findCourses(search));
  }

  return res.status(200).send(await getCoursesList());
}

async function httpFindCourseById(req, res) {
  const courseID = req.params.id;

  const course = await findCourseByID(courseID);
  if (!course) {
    return res.status(404).send({ message: 'Course not found' });
  }

  return res.status(200).send(course);
}

async function httpCreateCourse(req, res) {
  const errMsg = validateCourse(req.body);
  if (errMsg) {
    return res.status(400).send({ message: errMsg });
  }

  const { courseName } = req.body;
  const courseExist = await findCourseByName(courseName);
  if (courseExist) {
    return res.status(400).send({ message: 'course already exists' });
  }

  await createCourse(req.body);
  return res.status(201).send({ message: 'Course added successfully' });
}

async function httpUpdateCourse(req, res) {
  const courseID = req.params.id;

  const course = await findCourseByID(courseID);
  if (!course) {
    return res.status(404).send({ message: 'Course not found!' });
  }

  if (course.courseID !== +courseID) {
    return res.status(400).send({ message: 'course already exists' });
  }

  await updateCourse(courseID, { ...course, ...req.body });
  return res.status(200).send({ message: 'Course updated successfully' });
}

async function httpDeleteCourse(req, res) {
  const courseID = req.params.id;

  const course = await findCourseByID(courseID);
  if (!course) {
    return res.status(404).send({ message: 'Course not found!' });
  }

  await deleteCourse(courseID);
  return res.status(200).send({ message: 'Course deleted successfully' });
}

module.exports = {
  httpFindCourses,
  httpFindCourseById,
  httpCreateCourse,
  httpUpdateCourse,
  httpDeleteCourse,
};
