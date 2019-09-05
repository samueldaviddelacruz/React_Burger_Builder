import axios from 'axios';

const instance = axios.create({
    baseURL:"https://react-burger-builder-d2639.firebaseio.com/"
});


export default instance;
