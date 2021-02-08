import axios from 'axios';

const api = axios.create({
  baseURL: process.env.baseUrl
});

export default {
  async get(path, params = {}) {
    return await api.get(path, params);
  },
  async post(path, data = {}) {
    return await api.post(path, data);
  },
  async postMutliPart(path, data = {}) {
    return await api.post(path, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}
