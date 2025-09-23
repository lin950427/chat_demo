import VConsole from 'vconsole';



// 生产环境配置
const PROD_CONFIG = {
    theme: 'light',
    defaultPlugins: ['system', 'network', 'element', 'storage'],
    maxLogNumber: 50,
    disableLogScrolling: true
};

let vConsole: VConsole | null = null;

export const initVConsole = () => {
    // 只在非生产环境或URL带有debug参数时初始化

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    vConsole = new VConsole(PROD_CONFIG);
};

export const getVConsole = () => vConsole;

export const showVConsole = () => vConsole?.show();

export const hideVConsole = () => vConsole?.hide();

