import axios from "axios";
import Cookies from 'js-cookie';

const setAuthToken = token => {
    if (token) {
        // Apply authorization token to every request if logged in
        axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get('XSRF-TOKEN')}`;
    } else {
        // Delete auth header
        delete axios.defaults.headers.common["Authorization"];
    }
};

export default setAuthToken;