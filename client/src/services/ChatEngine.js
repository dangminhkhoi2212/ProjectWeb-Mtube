import axios from 'axios';

const loginRest = async (username, secret) => {
    return await axios.get('https://api.chatengine.io/users/me/', {
        headers: {
            'Project-ID': import.meta.env.VITE_CHAT_ENGINE_PROJECT_ID,
            'User-Name': username,
            'User-Secret': secret,
        },
    });
};

const signupRest = async (username, secret, email, first_name, last_name) => {
    return await axios.post(
        'https://api.chatengine.io/users/',
        { username, secret, email, first_name, last_name },
        {
            headers: {
                'Private-Key': import.meta.env.VITE_CHAT_ENGINE_PRIVATE_KEY,
            },
        },
    );
};
const updateAvatarRest = async (username, secret, avatarFile) => {
    const apiUrl = 'https://api.chatengine.io/users/me/';

    try {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const response = await axios.patch(apiUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Project-ID': import.meta.env.VITE_CHAT_ENGINE_PROJECT_ID,
                'User-Name': username,
                'User-Secret': secret,
            },
        });
    } catch (error) {
        console.error('Error updating avatar', error);
    }
};
const deleteRest = async (username, secret) => {
    try {
        await axios.delete('https://api.chatengine.io/users/me/', {
            headers: {
                'Project-ID': import.meta.env.VITE_CHAT_ENGINE_PROJECT_ID,
                'User-Name': '@' + username,
                'User-Secret': secret,
            },
        });
    } catch (error) {
        console.log('🚀 ~ file: ChatEngine.js:53 ~ deleteRest ~ error:', error);
    }
};
export { loginRest, signupRest, updateAvatarRest, deleteRest };
