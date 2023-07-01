import createApiClient from './api.service';

class CommentService {
    constructor(baseUrl = 'comment') {
        this.api = createApiClient(baseUrl);
    }
    async getAll(videoId) {
        return (await this.api.get(`/${videoId}`)).data;
    }
    async create(data) {
        return (await this.api.post('/', data)).data;
    }
    async deleteAll() {
        return (await this.api.delete('/')).data;
    }
    async get(id) {
        return (await this.api.get(`/one/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/one/${id}`)).data;
    }
}
export default new CommentService();
