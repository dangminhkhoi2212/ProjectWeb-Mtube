import createApiClient from './api.service';

class VideoService {
    constructor(baseUrl = 'https://alive-visor.cyclic.app/video') {
        this.api = createApiClient(baseUrl);
    }
    async getAll(searchCriteria) {
        return (await this.api.get('/', { params: { searchCriteria } })).data;
    }
    async create(data) {
        return (await this.api.post('/', data)).data;
    }
    async deleteAll() {
        return (await this.api.delete('/')).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(videoId, data) {
        return (await this.api.put(`/${videoId}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async handleLike(videoId, accountId) {
        return (await this.api.put(`/${videoId}`, { accountId })).data;
    }
}
export default new VideoService();
