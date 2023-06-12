import createApiClient from './api.service';

class AccountService {
    constructor(baseUrl = '/account') {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get('/')).data;
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
    async getAvatar(id) {
        return (await this.api.get(`/avatar/${id}`)).data;
    }
    async getLogin(username, password) {
        return (
            await this.api.post(`/login`, {
                username,
                password,
            })
        ).data;
    }
    async update(id, data, token) {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        return (await this.api.put(`/${id}`, data, config)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async addVideo(id, videoId) {
        return (await this.api.put(`/myVideos/${id}/${videoId}`)).data;
    }
    async removeVideo(id, videoId) {
        return (await this.api.delete(`/myVideos/${id}/${videoId}`)).data;
    }
    async removeAllVideo(id) {
        return (await this.api.delete(`/myVideos/${id}`)).data;
    }
}
export default new AccountService();
