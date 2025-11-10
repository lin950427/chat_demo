import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IS_SIGNED_KEY, LANGUAGE_KEY, SUPPORT_LANGUAGES } from "@/constant";
import { LanguageDrawer } from "@/components/ui/language-drawer";
import NoticeModal from "@/components/notice-modal";

const Home = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // 初始化时检查保存的语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    const isSigned = localStorage.getItem(IS_SIGNED_KEY);
    if (savedLanguage && isSigned) {
      // 如果已经选择了语言，直接跳转到聊天页面，保留 query 参数
      // const currentSearchParams = new URLSearchParams(window.location.search);
      navigate({
        pathname: '/chat',
        // search: currentSearchParams.toString()
      }, { replace: true });
      return;
    }

    // 未选择语言时默认展示中文
    // setSelectedLanguage("zh-CN");
    // i18n.changeLanguage("zh-CN");
    setIsReady(true);
  }, []);

  const handleEnter = useCallback(() => {
    localStorage.setItem(LANGUAGE_KEY, i18n.language || 'zh-CN');
    if (localStorage.getItem(IS_SIGNED_KEY)) {
      navigate('/chat');
    } else {
      setModalVisible(true);
    }
  }, [i18n.language, navigate]);

  const handleAgree = useCallback(() => {
    localStorage.setItem(IS_SIGNED_KEY, '1');
    setModalVisible(false);
    navigate('/chat');
  }, [navigate]);

  const handleDisagree = useCallback(() => {
    setModalVisible(false);
    localStorage.removeItem(IS_SIGNED_KEY);
  }, []);

  // 等待i18n初始化完成
  if (!isReady) return null;

  const base = import.meta.env.BASE_URL || "/";
  const avatarSrc = `${base.replace(/\/$/, "")}/xiaohong.gif`;

  // if (localStorage.getItem(LANGUAGE_KEY)) return null;

  return (
    <>
      <NoticeModal
        visible={modalVisible}
        onAgree={handleAgree}
        onDisagree={handleDisagree}
      />
      <div
        className="min-h-screen flex flex-col px-10 bg-[#cbb486]"
      >
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center pt-12">
          {/* Avatar */}
          <div className="mb-8 w-36 h-36">
            <img
              src={avatarSrc}
              alt="avatar"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && parent.querySelector('[data-fallback]') == null) {
                  const span = document.createElement('span');
                  span.dataset.fallback = 'true';
                  span.textContent = '🤖';
                  span.className = 'text-5xl';
                  parent.appendChild(span);
                }
              }}
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h1 className="text-white text-xl font-medium">
              您好，我是你的专属AI助手小虹
            </h1>
            <p className="text-[#7F5B14] text-sm font-semibold">
              Hello, I am your dedicated AI assistant Xiao Hong.
            </p>
          </div>

          {/* Language Selection Section */}
          <div className="w-full max-w-sm">
            <div className="text-center text-white mb-6 font-semibold">
              <div className="text-lg font-medium">
                请设置你的默认语言
              </div>
              <div className="text-[#7F5B14] text-sm">
                Please set your default language.
              </div>
            </div>

            {/* Language Selector Button */}
            <div className="mb-16">
              <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-white bg-opacity-60 backdrop-blur-sm rounded-lg py-2 px-4 text-[#7F5B14] flex justify-between items-center border border-white/20"
              >
                <span />
                <div className="text-center">
                  <div className="font-medium">
                    {SUPPORT_LANGUAGES.find(lang => lang.code === i18n.language)?.nativeName || '简体中文'}
                  </div>
                  <div className="text-[10px] font-semibold">
                    {SUPPORT_LANGUAGES.find(lang => lang.code === i18n?.language)?.name || 'Simplified Chinese'}
                  </div>
                </div>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Start Button */}
            <button
              onClick={handleEnter}
              className="fixed bottom-16 w-[calc(100vw-80px)] bg-[#C2A168] backdrop-blur-sm text-white p-4 rounded-lg flex items-center justify-between border border-white/20 transition-colors"
            >
              <span className="font-medium">{t("home.enterNow")}</span>
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_32_681)">
                  <path d="M0.625 8L19.2917 8" stroke="white" stroke-width="1.86667" />
                  <path d="M12.875 1L19.875 8L12.875 15" stroke="white" stroke-width="1.86667" />
                </g>
                <defs>
                  <clipPath id="clip0_32_681">
                    <rect width="22" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>

            </button>
          </div>
        </div>

        {/* Language Drawer */}
        <LanguageDrawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </>
  );
}

export default Home;