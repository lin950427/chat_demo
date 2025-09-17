import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import lottie from "lottie-web";

interface WelcomeProps {
  onQuestionClick?: (question: string) => void;
}

export function Welcome({ onQuestionClick }: WelcomeProps) {
  const { t } = useTranslation();
  const lottieContainer = useRef<HTMLDivElement>(null);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  // 获取当前语言的问题组
  const questionGroups = [
    t("questions.group1", { returnObjects: true }) as string[],
    t("questions.group2", { returnObjects: true }) as string[],
    t("questions.group3", { returnObjects: true }) as string[],
    t("questions.group4", { returnObjects: true }) as string[],
  ];

  // 获取当前显示的问题组
  const currentQuestions = questionGroups[currentGroupIndex] || [];

  // 换一批问题
  const handleRefreshQuestions = () => {
    setCurrentGroupIndex((prev) => (prev + 1) % questionGroups.length);
  };

  useEffect(() => {
    // 首先设置一个默认的占位符
    if (lottieContainer.current) {
      lottieContainer.current.innerHTML = `
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8B6D3F, #A67C52); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; animation: bounce 2s infinite;">
                    🤖
                </div>
            `;
    }

    // 然后尝试加载 Lottie 动画
    const loadAnimation = async () => {
      if (lottieContainer.current) {
        try {
          // 清空容器
          lottieContainer.current.innerHTML = "";

          // 通过 BASE_URL 生成正确的发布路径，兼容非根路径部署
          const base = import.meta.env.BASE_URL || "/";
          const animPath = `${base.replace(/\/$/, "")}/animations/welcome-bot.json`;

          console.log("Loading Lottie animation from:", animPath);

          // 直接使用 lottie 的 path 让其内部处理加载，避免旧端 fetch 兼容问题
          const anim = lottie.loadAnimation({
            container: lottieContainer.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: animPath,
          });

          // 监听加载事件
          anim.addEventListener("DOMLoaded", () => {
            console.log("Lottie animation DOM loaded successfully");
          });

          anim.addEventListener("data_ready", () => {
            console.log("Lottie animation data ready");
          });

          anim.addEventListener("config_ready", () => {
            console.log("Lottie animation config ready");
          });

          anim.addEventListener("data_failed", (error) => {
            console.error("Lottie animation data failed:", error);
            // 恢复静态内容
            if (lottieContainer.current) {
              lottieContainer.current.innerHTML = `
                                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8B6D3F, #A67C52); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                                    🤖
                                </div>
                            `;
            }
          });

          return () => anim.destroy();
        } catch (error) {
          console.error("Failed to load Lottie animation:", error);
          // 如果动画加载失败，恢复静态内容
          if (lottieContainer.current) {
            lottieContainer.current.innerHTML = `
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8B6D3F, #A67C52); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                                🤖
                            </div>
                        `;
          }
        }
      }
    };

    const timer = setTimeout(loadAnimation, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-xl mx-auto w-full py-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center -mt-2">
          {/* 头像容器 */}
          <div
            ref={lottieContainer}
            className="w-36 h-36 -ml-6 -mr-2 flex-none flex items-center justify-center overflow-hidden"
            style={{ minWidth: "144px", minHeight: "144px" }}
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-warm-brown-700 mb-2">
              {t("chat.welcome.greeting")}
            </h2>
            <p className="text-base text-warm-brown-800 mb-1">
              {t("chat.welcome.introduction")}
            </p>
            <p className="text-sm text-warm-brown-600">
              {t("chat.welcome.description")}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-warm-brown-600 mb-3">
            {t("chat.welcome.tryAsk")}
          </p>
          <div className="flex flex-col gap-2 mb-4">
            {currentQuestions.map((question: string, index: number) => (
              <button
                key={`${currentGroupIndex}-${index}`}
                onClick={() => onQuestionClick?.(question)}
                className="flex items-center justify-between text-left text-sm px-4 py-2 rounded-lg bg-warm-brown-50 hover:bg-warm-brown-100 text-warm-brown-800 border border-warm-brown-200 transition-colors">
                <span>{question}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="flex-none text-warm-brown-500">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleRefreshQuestions}
              className="flex items-center gap-2 px-4 py-2 text-sm text-warm-brown-600 hover:text-warm-brown-700 hover:bg-warm-brown-50 rounded-lg transition-colors border border-warm-brown-200">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              {t("chat.welcome.refresh")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
