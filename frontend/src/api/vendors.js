import api, { unwrap, unwrapList } from './client';

export const vendorsApi = {
  list: (params) => api.get('/vendors', { params }).then(unwrapList),
  get: (id) => api.get(`/vendors/${id}`).then((r) => r.data.data.vendor),
  create: (body) => api.post('/vendors', body).then((r) => r.data.data.vendor),
  update: (id, body) => api.put(`/vendors/${id}`, body).then((r) => r.data.data.vendor),
  remove: (id) => api.delete(`/vendors/${id}`).then(unwrap),
};
