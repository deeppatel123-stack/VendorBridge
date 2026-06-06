import api, { unwrap, unwrapList } from './client';

export const quotationsApi = {
  list: (params) => api.get('/quotations', { params }).then(unwrapList),
  get: (id) => api.get(`/quotations/${id}`).then(unwrap),
  compare: (rfqId) => api.get(`/quotations/compare/${rfqId}`).then(unwrap),
  create: (body) => api.post('/quotations', body).then((r) => r.data.data.quotation),
  select: (id) => api.patch(`/quotations/${id}/select`).then(unwrap),
};
