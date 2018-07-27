import axios from 'axios'
import {getStore,removeStore} from './util'
import router from '../router/index'
import {baseUrl} from './constants'

axios.defaults.timeout=5000;
axios.defaults.baseURL=baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(
    config => {
        console.log(`发起请求:path:${config.url},baseUrl:${config.baseURL}`)

        const token=JSON.parse(getStore('authToken'))
        if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token   
            const accessToken=token.accessToken;
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
  });

  axios.interceptors.response.use( 
    response => {
      return response ;
    },
    error => {
      if(error && error.response){
        
         switch(error.response.status){
            case 401 :
            //清楚token 并跳转登陆界面
            removeStore('authToken');
            router.replace({
              path:'login',
              query:{
                redirect: router.currentRoute.fullPath
              }
            })
            break;
           case 403 :
           removeStore('authToken');      
           router.replace({
             path:'login',
             query:{
               redirect: router.currentRoute.fullPath
             }
           })
           break;
          default:
            error.message = `连接错误${err.response.status}`
         }
      }else{
        error.message= "连接到服务器失败"
      }
      console.log(error.message)
      return Promise.reject(error.response);  //返回接口返回的错误信息
    })
 


export  default {
    get:function(url,data = {}){
        return new Promise((resolve,reject) => {
            axios.get(url,data)
                     .then(response => {          
                 resolve(response.data);
                     },err => {           
                         reject(err)
                     })
        })
    },
    post:function(url,data = {}){
        return new Promise((resolve,reject) => {
            axios.post(url,data)
                     .then(response => {          
                 resolve(response.data);
                     },err => {           
                         reject(err)
                     })
        })
    },
    put:function(url,data = {}){
 
        return new Promise((resolve,reject) => {
            axios.put(url,data)
                     .then(response => {          
                 resolve(response.data);
                     },err => {           
                         reject(err)
                     })
        })
    } 
}