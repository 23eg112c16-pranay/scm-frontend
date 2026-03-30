const BASE_URL = import.meta.env.VITE_API_URL || "https://scm-backend-ygsj.onrender.com/api";

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
};

export const getStudents = () => request("/students");
export const getStudentById = (id) => request(`/students/${id}`);
export const createStudent = (data) => request("/students", { method: "POST", body: JSON.stringify(data) });
export const updateStudent = (id, data) => request(`/students/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteStudent = (id) => request(`/students/${id}`, { method: "DELETE" });

export const getCourses = () => request("/courses");
export const getCourseById = (id) => request(`/courses/${id}`);
export const createCourse = (data) => request("/courses", { method: "POST", body: JSON.stringify(data) });
export const updateCourse = (id, data) => request(`/courses/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteCourse = (id) => request(`/courses/${id}`, { method: "DELETE" });

export const getEnrollments = () => request("/enrollments");
export const getEnrollmentById = (id) => request(`/enrollments/${id}`);
export const createEnrollment = (data) => request("/enrollments", { method: "POST", body: JSON.stringify(data) });
export const updateEnrollment = (id, data) => request(`/enrollments/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteEnrollment = (id) => request(`/enrollments/${id}`, { method: "DELETE" });