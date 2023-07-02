export const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('🚀 ~ file: api.service.js:5 ~ token:', token);
    return token;
};
