import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { PersonIcon, GearIcon, HomeIcon } from "@radix-ui/react-icons";
import { LoadingDots } from "@/components/ui/loading-dots";
import { useTranslation } from "react-i18next";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");

  const categories = [
    {
      id: "ai",
      name: "人工客服",
      icon: PersonIcon,
      message: "请为我转接人工客服",
    },
    {
      id: "policy",
      name: "人才政策",
      icon: GearIcon,
      message: "请介绍一下人才政策",
    },
    {
      id: "district",
      name: "虹口区补贴政策",
      icon: HomeIcon,
      message: "请介绍一下虹口区补贴政策",
    },
  ];

  const handleCategoryClick = (category: (typeof categories)[0]) => {
    if (disabled) return;
    onSubmit(category.message);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSubmit(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 只有在桌面端按下 Ctrl/Cmd + Enter 才发送消息
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (!input.trim()) return;
      onSubmit(input.trim());
      setInput("");
    }
    // 移动端和普通回车都是换行，不做任何处理
  };

  return (
    <form onSubmit={handleSubmit} >
      <div className="flex gap-2 py-1 pl-3 overflow-x-auto no-scrollbar">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category)}
              disabled={disabled}
              className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md leading-5 font-semibold border border-border shrink-0  hover:bg-warm-brown-50 disabled:opacity-50 disabled:cursor-not-allowed text-[#333333] ${disabled ? 'bg-[#f5f3ed] ' : 'bg-white'}`}>
              <Icon className="w-3 h-4.5" color="#7F5B14" />
              {category.name}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 pt-2 px-3 pb-5" style={{
        marginBottom: 'env(safe-area-inset-bottom, 20px)',
      }}>
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
