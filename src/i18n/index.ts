import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 中文翻译
const zhCN = {
  common: {
    confirm: "确认",
    cancel: "取消",
    loading: "加载中...",
    error: "错误",
    success: "成功",
    back: "返回",
    close: "关闭",
  },
  home: {
    title: "选择您的语言",
    subtitle: "请选择您偏好的语言来开始使用AI助手",
    chinese: "中文",
    english: "English",
    start: "开始聊天",
  },
  chat: {
    title: "AI助手",
    header: {
      greeting: {
        morning: "早上好",
        afternoon: "下午好",
        evening: "晚上好"
      },
      serviceIntro: "专属客服小虹为您服务"
    },
    welcome: {
      greeting: "Hi",
      introduction: "我是你的专属AI助手小虹",
      description: "专注帮大家解决人才服务相关问题",
      tryAsk: "可以试试问我：",
      refresh: "换一批问题",
    },
    input: {
      placeholder: "请输入您的问题...",
      send: "发送",
    },
    references: {
      summary: "参考{{count}}篇内容为你总结",
    },
    possibleApplications: "你可能要申请事项",
    applyNow: "前往申请",
    thinking: "正在思考中...",
  },
  questions: {
    group1: [
      "如何申请人才引进落户？",
      "人才引进补贴标准是多少？",
      "引进人才享哪些税收优惠？",
      "应届生落户有限制吗？",
      "积分落户怎么算分？",
    ],
    group2: [
      "高层次人才认定标准？",
      "人才公寓申请条件？",
      "创业扶持政策有哪些？",
      "博士后工作站怎么申请？",
      "海外人才引进流程？",
    ],
    group3: [
      "人才绿卡有什么用？",
      "子女入学优惠政策？",
      "医疗保障待遇标准？",
      "配偶就业安置政策？",
      "住房补贴如何申请？",
    ],
    group4: [
      "科研经费支持标准？",
      "技能人才评定条件？",
      "创新团队奖励政策？",
      "人才培训补贴标准？",
      "职业技能提升计划？",
    ],
  },
};

// 英文翻译
const enUS = {
  common: {
    confirm: "Confirm",
    cancel: "Cancel",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    back: "Back",
    close: "Close",
  },
  home: {
    title: "Choose Your Language",
    subtitle:
      "Please select your preferred language to start using the AI assistant",
    chinese: "中文",
    english: "English",
    start: "Start Chat",
  },
  chat: {
    title: "AI Assistant",
    header: {
      greeting: {
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening"
      },
      serviceIntro: "AI Assistant Xiao Hong at your service"
    },
    welcome: {
      greeting: "Hi",
      introduction: "I am your dedicated AI assistant Xiao Hong",
      description:
        "Focused on helping everyone solve talent service related issues",
      tryAsk: "You can try asking me:",
      refresh: "Get More Questions",
    },
    input: {
      placeholder: "Please enter your question...",
      send: "Send",
    },
    references: {
      summary: "Referenced {{count}} documents to summarize for you",
    },
    possibleApplications: "Possible Applications",
    applyNow: "Apply Now",
    thinking: "Thinking...",
  },
  questions: {
    group1: [
      "How to apply for talent introduction settlement?",
      "What is the talent introduction subsidy standard?",
      "What tax benefits do introduced talents enjoy?",
      "Are there restrictions for fresh graduate settlement?",
      "How to calculate points for point-based settlement?",
    ],
    group2: [
      "High-level talent recognition standards?",
      "Talent apartment application conditions?",
      "What entrepreneurship support policies are there?",
      "How to apply for postdoctoral workstation?",
      "Overseas talent introduction process?",
    ],
    group3: [
      "What is the use of talent green card?",
      "Children enrollment preferential policies?",
      "Medical insurance benefit standards?",
      "Spouse employment placement policies?",
      "How to apply for housing subsidies?",
    ],
    group4: [
      "Research funding support standards?",
      "Skilled talent evaluation conditions?",
      "Innovation team reward policies?",
      "Talent training subsidy standards?",
      "Vocational skill improvement plans?",
    ],
  },
};

const resources = {
  "zh-CN": {
    translation: zhCN,
  },
  "en-US": {
    translation: enUS,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "zh-CN",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
