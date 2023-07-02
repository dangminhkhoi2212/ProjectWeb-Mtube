import createApiClient from './api.service';
const token = localStorage.getItem('token');
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};
class CommentService {
    constructor(baseUrl = '/comment') {
        this.api = createApiClient(baseUrl);
    }
    async getAll(videoId) {
        return (await this.api.get(`/${videoId}`)).data;
    }
    async create(data) {
        return (await this.api.post('/', data, config)).data;
    }
    async deleteAll() {
        return (await this.api.delete('/', config)).data;
    }
    async get(id) {
        return (await this.api.get(`/one/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data, config)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/one/${id}`, config)).data;
    }
}
export default new CommentService();
