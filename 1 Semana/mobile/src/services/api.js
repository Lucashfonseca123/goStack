import axios from 'axios';

const api = axios.create({
    //Se for com o dispotivo fisico, necessário colocar o id da máquina
    baseURL: 'http://localhost:3333'
});

export default api;