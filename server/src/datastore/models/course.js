import pool from '..';

async function getCoursesList() {
  const sql = `SELECT * FROM course WHERE deletedAt IS NULL`;

  const result = await pool.execute(sql);
  return result[0];
}

async function findCourses(search) {
  const sql = `SELECT * FROM course WHERE deletedAt IS NULL AND courseName LIKE ?`;

  const result = await pool.query(sql, [`${search}%`]);
  return result[0];
}

async function findCourseByID(courseID) {
  const sql = `SELECT * FROM course WHERE deletedAt IS NULL AND courseID = ?`;

  const [course] = await pool.execute(sql, [courseID]);
  return course[0];
}

async function findCourseByName(courseName) {
  const sql = `SELECT * FROM course WHERE deletedAt IS NULL AND courseName = ?`;

  const [course] = await pool.execute(sql, [courseName]);
  return course[0];
}

async function createCourse(course) {
  return await pool.execute(
    `INSERT INTO course SET courseName=?, costCenter=?, coursePrice=?, currency=?`,
    [course.courseName, course.costCenter, course.coursePrice, course.currency]
  );
}

async function updateCourse(courseID, course) {
  const sql = `
    UPDATE course
      SET courseName = ?, costCenter = ?, coursePrice = ?, currency = ?
      WHERE courseID = ? AND deletedAt IS NULL;
    `;

  return await pool.execute(sql, [
    course.courseName,
    course.costCenter,
    course.coursePrice,
    course.currency,
    courseID,
  ]);
}

async function deleteCourse(courseID) {
  const sql = `UPDATE course SET deletedAt = NOW() WHERE courseID = ?;`;

  return await pool.execute(sql, [courseID]);
}

export {
  getCoursesList,
  findCourses,
  createCourse,
  findCourseByID,
  findCourseByName,
  updateCourse,
  deleteCourse,
};
