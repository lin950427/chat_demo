import { useMemo, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { PersonIcon, GearIcon, HomeIcon } from "@radix-ui/react-icons";
import { LoadingDots } from "@/components/ui/loading-dots";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { getQuestions } from "@/lib/api/question";
import type { SecondaryQuestions } from "@/lib/api/types";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const { i18n, t } = useTranslation();
  const [input, setInput] = useState("");
  const isZH = i18n.language === "zh-CN"
  const { data: questionsInfo } = useSWR(['getQuestions'], getQuestions);
  const questions = useMemo(() => questionsInfo?.part2 || [], [questionsInfo])


  const icons = [PersonIcon, GearIcon, HomeIcon]

  const handleQuestionClick = (question: SecondaryQuestions) => {
    if (disabled) return;
    onSubmit(isZH ? question.zh_question : question.en_question);
    resetTextareaHeight();
  };

  // 重置输入框高度
  const resetTextareaHeight = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = '36px'; // 恢复到初始高度
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSubmit(input.trim());
    setInput("");
    resetTextareaHeight();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 只有在桌面端按下 Ctrl/Cmd + Enter 才发送消息
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (!input.trim()) return;
      onSubmit(input.trim());
      setInput("");
      resetTextareaHeight();
    }
    // 移动端和普通回车都是换行，不做任何处理
  };

  return (
    <form onSubmit={handleSubmit} >
      <div className="flex py-1 pl-3 overflow-x-auto no-scrollbar">
        {questions.map((category, index) => {
          const Icon = icons[index % 3];
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleQuestionClick(category)}
              disabled={disabled}
              className={`mr-2 flex items-center px-3 py-1 text-xs rounded-md leading-5 font-semibold border border-border shrink-0  hover:bg-warm-brown-50 disabled:opacity-50 disabled:cursor-not-allowed text-[#333333] ${disabled ? 'bg-[#f5f3ed] ' : 'bg-white'}`}>
              <Icon className="w-3 h-4.5 mr-1" color="#7F5B14" />
              {isZH ? category.zh_title : category.en_title}
            </button>
          );
        })}
      </div>
      <div className="flex pt-2 pb-5 px-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chat.input.placeholder")}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 min-h-[36px] max-h-[120px] rounded-md px-4 py-1 resize-none",
            "bg-white border border-warm-brown-200",
            "placeholder:text-neutral-500/30",
            "focus:outline-none focus:ring-1 focus:ring-warm-brown-400",
            disabled ? "cursor-not-allowed bg-[#eee7db]" : "bg-white"
          )}
          style={{
            // height: "auto",
            // minHeight: "px",
            // maxHeight: "120px",
            overflow: "auto",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
        />
        <span className="w-2 inline-block" />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className={cn(
            "px-4 h-9 rounded-md text-sm font-semibold flex items-center justify-center self-end",
            "bg-[#C2A168] text-white",
            "hover:bg-warm-brown-700",
            "focus:outline-none focus:ring-1 focus:ring-warm-brown-400",
            (disabled || !input.trim()) && "opacity-50 cursor-not-allowed"
          )}>
          {disabled ? (
            <LoadingDots className="scale-90" />
          ) : (
            t("chat.input.send")
          )}
        </button>
      </div>
    </form>
  );
}
