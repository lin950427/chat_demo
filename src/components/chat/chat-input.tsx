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
    <form onSubmit={handleSubmit} className="border-t">
      <div className="flex gap-2 p-2 overflow-x-auto bg-muted/50">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category)}
              disabled={disabled}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-background border shrink-0 hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon className="w-3 h-3" />
              {category.name}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chat.input.placeholder")}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 min-h-[40px] max-h-[120px] rounded-md px-3 py-2 resize-none",
            "bg-background border border-input",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{
            height: "auto",
            minHeight: "40px",
            maxHeight: "120px",
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
            "px-6 h-10 rounded-full text-sm font-medium flex items-center justify-center min-w-[80px] self-end",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90",
            "focus:outline-none focus:ring-2 focus:ring-ring",
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
