// 微信小程序相关类型定义
interface WxResponse {
  errMsg?: string;
}

interface WxError {
  errMsg: string;
  errCode?: number;
}

interface WxDownloadFileResponse extends WxResponse {
  tempFilePath: string;
  statusCode: number;
}

interface Window {
  __wxjs_environment?: "miniprogram" | string;
  wx?: {
    previewDocument: (options: {
      url: string;
      name: string;
      success?: (res: WxResponse) => void;
      fail?: (error: WxError) => void;
      complete?: (res: WxResponse | WxError) => void;
    }) => void;
    downloadFile?: (options: {
      url: string;
      header?: Record<string, string>;
      success?: (res: WxDownloadFileResponse) => void;
      fail?: (error: WxError) => void;
      complete?: (res: WxDownloadFileResponse | WxError) => void;
    }) => void;
    openDocument?: (options: {
      filePath: string;
      fileType?: string;
      success?: (res: WxResponse) => void;
      fail?: (error: WxError) => void;
      complete?: (res: WxResponse | WxError) => void;
    }) => void;
    showToast?: (options: {
      title: string;
      icon?: "success" | "loading" | "none";
      image?: string;
      duration?: number;
      mask?: boolean;
      success?: (res: WxResponse) => void;
      fail?: (error: WxError) => void;
      complete?: (res: WxResponse | WxError) => void;
    }) => void;
    showModal?: (options: {
      title: string;
      content?: string;
      showCancel?: boolean;
      cancelText?: string;
      cancelColor?: string;
      confirmText?: string;
      confirmColor?: string;
      success?: (res: { confirm: boolean; cancel: boolean }) => void;
      fail?: (error: WxError) => void;
      complete?: (res: { confirm: boolean; cancel: boolean } | WxError) => void;
    }) => void;
  };
  RandomJSBridge?: {
    previewFile: (options: {
      fileContent: string;
      fileName: string;
      fileType?: string;
      success?: (res: { message?: string }) => void;
      fail?: (error: { message: string; code?: number }) => void;
      complete?: (
        res: { message?: string } | { message: string; code?: number }
      ) => void;
    }) => void;
  };
}
