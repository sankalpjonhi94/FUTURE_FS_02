import API from './axios';

export const getLeadsApi = (params) => API.get('/leads', { params });
export const getLeadApi = (id) => API.get(`/leads/${id}`);
export const createLeadApi = (data) => API.post('/leads', data);
export const updateLeadApi = (id, data) => API.put(`/leads/${id}`, data);
export const deleteLeadApi = (id) => API.delete(`/leads/${id}`);
export const convertLeadApi = (id) => API.post(`/leads/${id}/convert`);

export const getCustomersApi = (params) => API.get('/customers', { params });
export const getCustomerApi = (id) => API.get(`/customers/${id}`);
export const createCustomerApi = (data) => API.post('/customers', data);
export const updateCustomerApi = (id, data) => API.put(`/customers/${id}`, data);
export const deleteCustomerApi = (id) => API.delete(`/customers/${id}`);

export const getTasksApi = (params) => API.get('/tasks', { params });
export const createTaskApi = (data) => API.post('/tasks', data);
export const updateTaskApi = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTaskApi = (id) => API.delete(`/tasks/${id}`);

export const getDashboardStatsApi = () => API.get('/dashboard/stats');
export const getActivitiesApi = () => API.get('/dashboard/activities');
