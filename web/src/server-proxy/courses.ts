import API from './config';

export async function getCourses(search: string = '') {
  const res = await API.get('/courses', { params: { search } });

  return res.data;
}

export async function createCourse(payload: any) {
  const res = await API.post('/courses', payload);

  return res.data;
}

export async function editCourse(courseId: string, payload: any) {
  const res = await API.put(`/courses/${courseId}`, payload);

  return res.data;
}

export async function deleteCourse(courseId: string) {
  const res = await API.delete(`/courses/${courseId}`);

  return res.data;
}
