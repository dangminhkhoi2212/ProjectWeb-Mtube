import createApiClient from './api.service';
const token = localStorage.getItem('token');
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};
class VideoService {
    constructor(baseUrl = '/video') {
        this.api = createApiClient(baseUrl);
    }
    async getAll(searchCriteria) {
        return (await this.api.get('/', { params: { searchCriteria } })).data;
    }
    async create(data) {
        return (await this.api.post('/', data, config)).data;
    }
    async deleteAll() {
        return (await this.api.delete('/', config)).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(videoId, data) {
        return (await this.api.put(`/${videoId}`, data, config)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`, config)).data;
    }
    async handleLike(videoId, accountId) {
        return (await this.api.put(`/${videoId}`, { accountId }, config)).data;
    }
}
export default new VideoService();
