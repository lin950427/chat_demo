// import axios from 'axios';

// const baseURL = import.meta.env.VITE_API_BASE_URL || '';

// // 创建 axios 实例
// export const http = axios.create({
//   baseURL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // 基础 fetcher
// export const fetcher = async (url: string) => {
//   const response = await http.get(url);
//   return response.data;
// };

// // 带认证的 fetcher
// export const authenticatedFetcher = async (url: string) => {
//   const token = localStorage.getItem('access_token');
//   const response = await http.get(url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

// // POST 请求的 fetcher
// export const postFetcher = async (url: string, { arg }: { arg: any }) => {
//   const token = localStorage.getItem('access_token');
//   const response = await http.post(url, arg, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

// // 请求拦截器
// http.interceptors.request.use(
//   (config) => {
//     // 在这里可以添加通用的请求处理
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 响应拦截器
// http.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // 统一的错误处理
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // 未授权，可以在这里处理登出逻辑
//           break;
//         case 403:
//           // 禁止访问
//           break;
//         case 404:
//           // 资源不存在
//           break;
//         case 500:
//           // 服务器错误
//           break;
//       }
//     }
//     return Promise.reject(error);
//   }
// );