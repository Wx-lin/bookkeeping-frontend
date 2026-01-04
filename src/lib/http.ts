import axios from 'axios';

// 创建 axios 实例
export const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // TODO: 在这里添加 token
    // const token = await getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 直接返回 data，这样我们在业务代码中就不需要多解构一层 .data
    return response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // TODO: 处理未登录情况，跳转到登录页
          console.log('未授权，请登录');
          break;
        case 403:
          console.log('拒绝访问');
          break;
        case 404:
          console.log('请求的资源不存在');
          break;
        case 500:
          console.log('服务器错误');
          break;
        default:
          console.log('发生错误', error.message);
      }
    } else {
      console.log('网络错误', error.message);
    }
    return Promise.reject(error);
  }
);
