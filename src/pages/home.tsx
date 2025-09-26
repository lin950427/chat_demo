import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LANGUAGE_KEY } from "@/constant";

export function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  // 初始化时检查保存的语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) {
      // 如果已经选择了语言，直接跳转到聊天页面，保留 query 参数
      // const currentSearchParams = new URLSearchParams(window.location.search);
      navigate({
        pathname: '/chat',
        // search: currentSearchParams.toString()
      }, { replace: true });
      return;
    }
    
    // 未选择语言时默认展示中文
    setSelectedLanguage("zh-CN");
    i18n.changeLanguage("zh-CN");
    setIsReady(true);
  }, [i18n, navigate]);

  const languages = [
    {
      code: "zh-CN",
      name: t("home.chinese"),
      nativeName: "中文",
      flag: "🇨🇳",
    },
    {
      code: "en-US",
      name: t("home.english"),
      nativeName: "English",
      flag: "🇺🇸",
    },
  ];

  const handleSelect = (language: string) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem(LANGUAGE_KEY, language);
    // Navigate to chat page after language selection, preserving query params
    // const currentSearchParams = new URLSearchParams(window.location.search);
    navigate({
      pathname: '/chat',
      // search: currentSearchParams.toString()
    }, { replace: true });
  };  // 不再需要 handleStart 函数

  // 等待i18n初始化完成
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-brown-50 to-warm-brown-100 flex items-center justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-warm-brown-600 to-warm-brown-700 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-3xl text-white">🤖</span>
        </div>
      </div>
    );
  }

  const base = import.meta.env.BASE_URL || "/";
  const avatarSrc = `${base.replace(/\/$/, "")}/xiaohong.gif`;

  if(localStorage.getItem(LANGUAGE_KEY)) return null;

  return (
    <div className="min-h-dvh bg-gradient-to-br from-warm-brown-50 to-warm-brown-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-warm-brown-200">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="w-28 h-28 mx-auto mb-4 overflow-hidden flex items-center justify-center">
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && parent.querySelector('[data-fallback]') == null) {
                    const span = document.createElement('span');
                    span.dataset.fallback = 'true';
                    span.textContent = '🤖';
                    span.className = 'text-3xl text-white';
                    parent.appendChild(span);
                  }
                }}
              />
            </div>
            <h1 className="text-2xl font-bold text-warm-brown-800 mb-2">
              {t("home.title")}
            </h1>
            <p className="text-sm text-warm-brown-600">{t("home.subtitle")}</p>
          </div>

          {/* Language Selection */}
          <div className="space-y-3 mb-8">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleSelect(language.code)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center",
                  selectedLanguage === language.code
                    ? "border-warm-brown-600 bg-warm-brown-50 shadow-md"
                    : "border-warm-brown-200 hover:border-warm-brown-400 hover:bg-warm-brown-25"
                )}>
                <span className="text-2xl">{language.flag}</span>
                <span className="inline-block w-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium text-warm-brown-800">
                    {language.nativeName}
                  </div>
                  <div className="text-sm text-warm-brown-600">
                    {language.name}
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <div className="w-6 h-6 rounded-full bg-warm-brown-600 flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Start Button */}
          <button
            onClick={() => selectedLanguage && handleSelect(selectedLanguage)}
            disabled={!selectedLanguage}
            className={cn(
              "w-full py-3 px-4 rounded-xl font-medium transition-all duration-200",
              selectedLanguage
                ? "bg-warm-brown-600 hover:bg-warm-brown-700 text-white shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}>
            {t("home.start")}
          </button>

          {/* Footer */}
          {/* <div className="text-center mt-6">
            <p className="text-xs text-warm-brown-500">
              AI Assistant for Talent Services
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
