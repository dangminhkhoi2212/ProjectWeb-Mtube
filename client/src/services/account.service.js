import createApiClient from './api.service';

const token = localStorage.getItem('token');
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

class AccountService {
    constructor(baseUrl = '/account') {
        this.api = createApiClient(baseUrl);
    }
    async getAll(searchCriteria) {
        return (await this.api.get('/', { params: { searchCriteria } })).data;
    }
    async create(data) {
        return (await this.api.post('/', data)).data;
    }
    async deleteAll() {
        return (await this.api.delete('/', config)).data;
    }
    async getAccount(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async getLogin(username, password) {
        return (
            await this.api.post(`/login`, {
                username,
                password,
            })
        ).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data, config)).data;
    }
    async editDetail(accountId, data) {
        return (await this.api.put(`/editDetail/${accountId}`, data, config))
            .data;
    }
    async updateCover(accountId, data) {
        return (await this.api.put(`/updateCover/${accountId}`, data, config))
            .data;
    }
    async delete(accountId, password) {
        return (await this.api.post(`/${accountId}`, { password }, config))
            .data;
    }
    async getFavoriteVideos(id) {
        return (await this.api.get(`/favorite/${id}`, config)).data;
    }
    async addFavoriteVideo(accountId, videoId) {
        return (await this.api.put(`/favorite/${accountId}/${videoId}`, config))
            .data;
    }
    async removeFavoriteVideo(accountId, videoId) {
        return (
            await this.api.delete(`/favorite/${accountId}/${videoId}`, config)
        ).data;
    }
    async removeAllFavoriteVideos(accountId) {
        return (await this.api.delete(`/favorite/${accountId}`, config)).data;
    }
    async addVideo(id, videoId) {
        return (await this.api.put(`/myVideos/${id}/${videoId}`, config)).data;
    }
    async removeMyVideo(accountId, videoId) {
        return (
            await this.api.delete(`/myVideos/${accountId}/${videoId}`, config)
        ).data;
    }
    async removeAllVideo(id) {
        return (await this.api.delete(`/myVideos/${id}`, config)).data;
    }
    async handleFollow(accountIdA, accountIdB, status) {
        return (
            await this.api.put(
                '/handleFollow',
                {
                    accountIdA,
                    accountIdB,
                    status,
                },
                config,
            )
        ).data;
    }
}
export default new AccountService();
