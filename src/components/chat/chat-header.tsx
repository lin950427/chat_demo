import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import i18n from "@/i18n";
import { LanguageDrawer } from "../ui/language-drawer";

export function ChatHeader() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const base = import.meta.env.BASE_URL || "/";
    const avatarSrc = `${base.replace(/\/$/, "")}/xiaohong.gif`;

    // 根据当前时间获取问候语
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return t("chat.header.greeting.morning");
        } else if (hour >= 12 && hour < 18) {
            return t("chat.header.greeting.afternoon");
        } else {
            return t("chat.header.greeting.evening");
        }
    }, [t]);

    return (
        <div className="fixed pt-1.5 top-0 left-0 right-0 h-[78px] pl-[22px] z-10"
            style={{
                background: 'linear-gradient(#cbb486 0%, #ddd0b6 100%)'

            }}  >
            <div className="flex items-center justify-between">
                <div className="flex">
                    <div className="mr-3 shrink-0">
                        <img
                            src={avatarSrc}
                            alt="小虹"
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent && parent.querySelector('[data-fallback]') == null) {
                                    const span = document.createElement('span');
                                    span.dataset.fallback = 'true';
                                    span.textContent = '🤖';
                                    span.className = 'text-3xl';
                                    parent.appendChild(span);
                                }
                            }}
                        />
                    </div>
                    <div className="mt-[9px]">
                        <div className="text-sm text-white mb-0.5 font-semibold">Hi, {greeting}</div>
                        <div className="text-xs text-white font-medium">{t("chat.header.serviceIntro")}</div>
                    </div>
                </div>
                <div className="mr-4 relative shrink-0">
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center pl-2 pr-1.5 py-0.5 leading-5 rounded-[4px] bg-[#bcaa86] hover:bg-[#a38c6a] text-white text-xs transition-colors"
                        >
                            <svg className="mr-1" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="currentColor" />
                            </svg>
                            {i18n.language === 'zh-CN' ? '中文' : 'English'}
                            <svg className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <LanguageDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
                    </div>
                </div>
            </div>
        </div>
    );
}