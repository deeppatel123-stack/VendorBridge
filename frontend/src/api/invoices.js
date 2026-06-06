import api, { unwrap, unwrapList } from './client';

export const invoicesApi = {
  list: (params) => api.get('/invoices', { params }).then(unwrapList),
  get: (id) => api.get(`/invoices/${id}`).then(unwrap),
  create: (body) => api.post('/invoices', body).then(unwrap),
  fromPo: (poId) => api.post(`/invoices/from-po/${poId}`).then(unwrap),
};
