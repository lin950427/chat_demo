// import useSWR, { type SWRConfiguration } from 'swr';
// import { fetcher, authenticatedFetcher } from './fetcher';

// export function useAPI<T>(
//   key: string | null,
//   config?: SWRConfiguration,
//   needAuth = false
// ) {
//   return useSWR<T>(
//     key, 
//     needAuth ? authenticatedFetcher : fetcher, 
//     config
//   );
// }

// // 用于需要认证的 API
// export function useAuthAPI<T>(key: string | null, config?: SWRConfiguration) {
//   return useAPI<T>(key, config, true);
// }