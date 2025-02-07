import Axios from 'axios'
import config from "../config/"
import store from "../store/index"

const { baseURL } = config

const instance = Axios.create({

	baseURL: baseURL,
	timeout: 5000,
  headers: {

    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
    'Access-Control-Max-Age': '86400',
  },

})

instance.interceptors.request.use(

  (config) => {

    const state = store.getState();
    const token = state.auth?.token;

    if(token){

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }, 

  (error) => { 

     console.log(error)
  })
 
instance.interceptors.response.use((res) => {

  return res;

}, (error) => { 

  console.log(error) 

})


export default instance;
