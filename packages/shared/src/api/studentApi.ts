import api from './axios';

export const studentApi = {
  getStats: () => api.get('/student/stats'),
  getEnrolledCourses: () => api.get('/student/courses'),
  getCoursePlayerDetails: (courseId: string) => api.get(`/student/courses/${courseId}`),
  getUnits: () => api.get('/student/units'),
  getUnitDetails: (unitId: string) => api.get(`/student/units/${unitId}`),
  getAssignments: () => api.get('/student/assignments'),
  submitAssignment: (assignmentId: string, data: { file_url?: string, answer_text?: string }) => 
    api.post(`/student/assignments/${assignmentId}/submit`, data),
  markTopicComplete: (data: { topicId: string, courseId: string }) => 
    api.post('/student/progress/mark-complete', data),
  getLiveClasses: () => api.get('/student/live-classes'),
  getAnnouncements: () => api.get('/student/announcements'),
  getTickets: () => api.get('/student/tickets'),
  createTicket: (data: { subject: string, message: string, priority?: string }) => 
    api.post('/student/tickets', data),
  getAvailableCourses: () => api.get('/student/available-courses'),
  enrollInCourse: (courseId: string) => api.post('/student/enroll', { courseId }),
};
