import httpClient from './httpClient';
import getCsrfToken from './getCsrfToken';

const signin = async (email, password) => {
    await getCsrfToken();
    return httpClient.post('/signin', { email, password });
};

export default signin;