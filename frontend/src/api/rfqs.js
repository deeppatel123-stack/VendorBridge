import api, { unwrap, unwrapList } from './client';

export const rfqsApi = {
  list: (params) => api.get('/rfqs', { params }).then(unwrapList),
  get: (id) => api.get(`/rfqs/${id}`).then(unwrap),
  create: (body) => api.post('/rfqs', body).then((r) => r.data.data),
  update: (id, body) => api.put(`/rfqs/${id}`, body).then(unwrap),
  remove: (id) => api.delete(`/rfqs/${id}`).then(unwrap),
  publish: (id) => api.patch(`/rfqs/${id}/publish`).then(unwrap),
  draft: (id) => api.patch(`/rfqs/${id}/draft`).then(unwrap),
  assignVendors: (id, vendorIds) => api.patch(`/rfqs/${id}/vendors`, { vendorIds }).then(unwrap),
};
