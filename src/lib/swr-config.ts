

export const swrConfig = {
    // 窗口聚焦时是否重新验证，移动端禁用以优化性能
    revalidateOnFocus: false,

    // 网络恢复时是否重新验证
    revalidateOnReconnect: true,

    // 错误重试次数
    errorRetryCount: 3,

    // 请求去重时间窗口（毫秒）
    dedupingInterval: 2000,

    // 聚焦重新请求的节流时间（毫秒）
    focusThrottleInterval: 5000,

    // 加载超时时间（毫秒）
    loadingTimeout: 3000,

    // 不使用 React Suspense
    suspense: false,

    // 错误重试时间间隔（毫秒）
    errorRetryInterval: 5000,

    // 当组件被卸载时，缓存数据的时间（毫秒）
    // 设置为 0 表示组件卸载后立即删除缓存
    cleanupTime: 0,
};