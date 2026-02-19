import api from './axios';

export const studentApi = {
  getStats: () => api.get('/student/stats'),
  getEnrolledCourses: () => api.get('/student/courses'),
  getCoursePlayerDetails: (courseId: string) => api.get(`/student/courses/${courseId}`),
  markTopicComplete: (data: { topicId: string, courseId: string }) => 
    api.post('/student/progress/mark-complete', data),
  getLiveClasses: () => api.get('/student/live-classes'),
  getAnnouncements: () => api.get('/student/announcements'),
  getTickets: () => api.get('/student/tickets'),
  createTicket: (data: { subject: string, message: string, priority?: string }) => 
    api.post('/student/tickets', data),
};
