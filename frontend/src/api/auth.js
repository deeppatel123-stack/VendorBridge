import api, { unwrap } from './client';

export const authApi = {
  signup: (body) => api.post('/auth/signup', body).then(unwrap),
  login: (body) => api.post('/auth/login', body).then(unwrap),
  logout: () => api.post('/auth/logout').then(unwrap),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }).then(unwrap),
  me: () => api.get('/auth/me').then(unwrap),
};
