import { SUPPORT_LANGUAGES } from "@/constant";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";



interface LanguageDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LanguageDrawer({
    isOpen,
    onClose,
}: LanguageDrawerProps) {
    const { i18n } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);
    const [dragCurrentY, setDragCurrentY] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setIsDragging(true);
        setDragStartY(e.touches[0].clientY);
        setDragCurrentY(e.touches[0].clientY);
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging) return;

        // 防止默认滚动行为
        e.preventDefault();

        const currentY = e.touches[0].clientY;
        const deltaY = currentY - dragStartY;

        // 只允许向下拖拽
        if (deltaY > 0) {
            setDragCurrentY(currentY);

            // 使用 requestAnimationFrame 优化性能
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                if (contentRef.current) {
                    // 使用 transform3d 启用硬件加速，提高性能
                    contentRef.current.style.transform = `translate3d(0, ${deltaY}px, 0)`;
                }
            });
        }
    }, [isDragging, dragStartY]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging) return;

        const deltaY = dragCurrentY - dragStartY;
        const threshold = 80; // 下滑超过80px就关闭抽屉

        if (contentRef.current) {
            contentRef.current.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';

            if (deltaY > threshold) {
                // 关闭抽屉 - 使用 transform3d
                contentRef.current.style.transform = 'translate3d(0, 100%, 0)';
                setTimeout(() => {
                    onClose();
                }, 100); // 等待动画完成
            } else {
                // 回弹到原位置 - 使用 transform3d
                contentRef.current.style.transform = 'translate3d(0, 0, 0)';
            }

            // 重置transition
            setTimeout(() => {
                if (contentRef.current) {
                    contentRef.current.style.transition = '';
                }
            }, 300);
        }

        setIsDragging(false);
        setDragStartY(0);
        setDragCurrentY(0);
    }, [isDragging, dragCurrentY, dragStartY, onClose]);

    // 重置抽屉位置当打开时
    useEffect(() => {
        if (isOpen && contentRef.current) {
            contentRef.current.style.transform = 'translate3d(0, 0, 0)';
            // 启用 will-change 优化
            contentRef.current.style.willChange = 'transform';
        } else if (!isOpen && contentRef.current) {
            // 关闭时移除 will-change 以节省内存
            contentRef.current.style.willChange = 'auto';
        }
    }, [isOpen]);

    // 清理函数
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                {/* 遮罩层 */}
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-[998] animate-fade-in" />

                {/* 抽屉内容 */}
                <Dialog.Content
                    ref={contentRef}
                    className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[999] animate-slide-in-from-bottom"
                    style={{
                        transform: 'translate3d(0, 0, 0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* 抽屉头部 - 可拖拽区域 */}
                    <div
                        className="flex items-center justify-center py-3 border-gray-100 cursor-pointer select-none"
                        style={{
                            touchAction: 'pan-y',
                            WebkitUserSelect: 'none',
                            userSelect: 'none'
                        }}
                    >
                        <div className={`w-8 h-1 bg-[#E4E8EC] rounded-full transition-all duration-200 transform-gpu ${isDragging ? 'bg-[#999999] w-12 scale-110' : 'bg-[#E4E8EC] w-8 scale-100'
                            }`}></div>
                    </div>

                    {/* 标题 */}
                    <div className="px-4 py-3">
                        <Dialog.Title className="font-bold text-[#1A1C1E] text-center">
                            设置语言
                        </Dialog.Title>
                    </div>

                    {/* 语言选项 */}
                    <div className="px-4 py-2 max-h-96 overflow-y-auto no-scrollbar">
                        {SUPPORT_LANGUAGES.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => {
                                    i18n.changeLanguage(language.code);
                                    onClose();
                                }}
                                className={`w-full mb-3 flex items-center justify-between py-1.5 rounded-lg transition-colors transform-gpu will-change-transform`}
                            >
                                <div className="text-left">
                                    <div className="font-bold text-[#333333]">
                                        {language.nativeName}
                                    </div>
                                    <div className="text-[10px] leading-[18px] text-[#999999]">
                                        {language.name}
                                    </div>
                                </div>

                                {i18n.language === language.code && (
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.0742 1.75C15.8713 1.7426 20.2498 5.18406 20.25 10.9502C20.25 13.9108 19.2614 16.2141 17.6533 17.7773C16.041 19.3447 13.7216 20.25 10.915 20.25C5.45141 20.2499 1.74338 16.2376 1.75 10.9521C1.75665 5.74441 6.29364 1.75738 11.0742 1.75ZM16.4121 6.94629C15.554 6.16632 14.2265 6.22909 13.4463 7.08691L9.92676 10.957L8.98438 10.0146C8.16424 9.19494 6.83462 9.19468 6.01465 10.0146C5.19468 10.8346 5.19494 12.1642 6.01465 12.9844L8.51465 15.4844C8.92072 15.8904 9.4757 16.1133 10.0498 16.0996C10.6239 16.0859 11.1674 15.837 11.5537 15.4121L16.5537 9.91211C17.3337 9.05392 17.2702 7.7264 16.4121 6.94629Z" fill="#7F5B14" stroke="#7F5B14" stroke-width="2" stroke-linecap="square" stroke-linejoin="round" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* 底部安全区域 */}
                    <div className="h-8 bg-white"></div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}