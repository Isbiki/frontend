import httpClient from "./httpClient";

const getCsrfToken = async () => {
    const res = await httpClient.get('/csrf-token');
    const csrfToken = res.data.csrfToken;
    localStorage.setItem('csrfToken', csrfToken);
};

export default getCsrfToken;