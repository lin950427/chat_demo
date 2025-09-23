import { cn } from "@/lib/utils";
import { FileTextIcon } from "@radix-ui/react-icons";
import type { Reference, ReferenceItem } from "@/lib/api/types";
import { downloadDocument } from "@/lib/api/chat";
import { LoadingDots } from "@/components/ui/loading-dots";
import { useTranslation } from "react-i18next";
import { RecommendedQuestions } from "./recommended-questions";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { memo, useMemo } from 'react'

// 按钮组件
const CustomButton = ({ variant, url, children }: { variant: 'primary' | 'secondary'; url: string; children: React.ReactNode }) => {
  const className = variant === 'primary'
    ? 'bg-warm-brown-500 text-white hover:bg-warm-brown-600'
    : 'bg-warm-brown-100 text-warm-brown-800 hover:bg-warm-brown-200';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-md text-sm transition-colors no-underline my-1 mx-1",
        className
      )}
    >
      {children}
    </a>
  );
};

// 缓存正则表达式
const buttonRegex = /<<BUTTON\|(primary|secondary)\|([^|]+)\|([^>]+)>>/;

// 消息内容组件
const MessageContent = memo(({ content }: { content: string }) => {
  // 使用 useMemo 缓存处理后的内容
  const processedContent = useMemo(() => {
    // 检查是否包含自定义按钮格式，避免不必要的处理
    if (!content.includes('<<BUTTON|')) {
      return content;
    }

    // 将按钮格式转换为 markdown 链接
    return content.replace(
      buttonRegex,
      (_, variant, text, url) => `[${text}](button:${variant}:${url})`
    );
  }, [content]);

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ ...props }) => <p style={{ margin: 0 }} {...props} />,
        br: ({ ...props }) => <br style={{ display: 'none' }} {...props} />,
        a: ({ href, children }) => {
          if (href?.startsWith('button:')) {
            const [, variant, url] = href.split(':');
            return (
              <CustomButton
                variant={variant as 'primary' | 'secondary'}
                url={url}
              >
                {children}
              </CustomButton>
            );
          }
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-brown-600 hover:text-warm-brown-800 underline"
            >
              {children}
            </a>
          );
        }
      }}
    >
      {processedContent}
    </Markdown>
  );
});

interface MessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
    references?: Reference;
    reference?: ReferenceItem[];
  };
  className?: string;
  isLoading?: boolean;
  isWelcomeMessage?: boolean;
  onQuestionClick?: (question: string) => void;
}
const Message = ({ message, className, isLoading, isWelcomeMessage, onQuestionClick }: MessageProps) => {
  const { t } = useTranslation();
  const isUser = message.role === "user";

  const uniquedReferences = useMemo(() => {
    if (message.references?.chunks) {
      // 处理实时对话的引用格式
      const documents = new Map();
      message.references.chunks.forEach((chunk) => {
        if (!documents.has(chunk.document_id)) {
          documents.set(chunk.document_id, {
            document_id: chunk.document_id,
            document_name: chunk.document_name,
            dataset_id: chunk.dataset_id,
          });
        }
      });
      return Array.from(documents.values());
    } else if (message.reference) {
      // 处理历史消息的引用格式
      const documents = new Map();
      message.reference.forEach((ref) => {
        if (!documents.has(ref.document_id)) {
          documents.set(ref.document_id, {
            document_id: ref.document_id,
            document_name: ref.document_name,
            dataset_id: ref.dataset_id,
          });
        }
      });
      return Array.from(documents.values());
    }
    return [];
  }, [message.reference, message.references?.chunks]);

  if (isUser) {
    return (
      <div className={cn("flex w-full justify-end mb-6", className)}>
        <div
          className={cn(
            "flex flex-col rounded-md px-3 py-2.5 max-w-[88%] bg-primary text-primary-foreground"
          )}>
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  const handlePreviewDocument = async (
    datasetId: string,
    documentId: string,
    fileName: string
  ) => {
    try {

      // 使用已有的 downloadDocument API 获取文档
      const blob = await downloadDocument(datasetId, documentId, fileName);


      // 创建 blob URL
      const url = URL.createObjectURL(blob);

      // 使用 a 标签模拟点击，不限制文件类型
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 清理对象URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("文档预览失败:", error);
      alert(
        `文档预览失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  };

  // 获取头像路径
  const base = import.meta.env.BASE_URL || "/";
  const avatarSrc = `${base.replace(/\/$/, "")}/xiaohong.png`;
  const loadingGifSrc = `${base.replace(/\/$/, "")}/loading.gif`;

  return (
    <>
      <div className={cn("flex w-full mb-6", className)}>
        <div className="flex flex-row">
          {/* AI头像 */}
          <div className="flex-shrink-0 w-[30px] h-[30px] overflow-hidden rounded-[6px] bg-primary-background px-0.5 pt-0.5">
            <img
              src={avatarSrc}
              alt="AI助手"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && parent.querySelector('[data-fallback]') == null) {
                  const span = document.createElement('span');
                  span.dataset.fallback = 'true';
                  span.textContent = '🤖';
                  span.className = 'text-2xl flex items-center justify-center h-full';
                  parent.appendChild(span);
                }
              }}
            />
          </div>
          <span className="w-3 inline-block" />
          <div className="flex-1">
            <div
              className={cn(
                "flex flex-col rounded-md overflow-hidden max-w-[88%] bg-white border border-slate-200 transition-opacity duration-200",
              )}>
              {/* 消息内容 */}
              <div className="px-3 py-2.5">
                <div className="text-sm leading-5 whitespace-pre-wrap break-words text-slate-900">

                  {isLoading ? (
                    <span className="inline-flex items-center text-nowrap">正在输入<img src={loadingGifSrc} className="w-5 mr-3" /></span>
                  ) : (
                    <MessageContent content={message.content} />
                  )}
                </div>
              </div>

              {/* 引用资料 */}
              {uniquedReferences.length > 0 && (
                <div className="border-t border-slate-200 bg-slate-50">
                  <div className="p-3">
                    <div className="text-xs text-slate-600 mb-2">
                      {t("chat.references.summary", {
                        count: uniquedReferences.length,
                      })}
                    </div>
                    <div className="flex flex-col">
                      {uniquedReferences.map((doc, index) => (
                        <button
                          key={doc.document_id}
                          onClick={() =>
                            handlePreviewDocument(
                              doc.dataset_id,
                              doc.document_id,
                              doc.document_name
                            )
                          }
                          disabled={isLoading}
                          className={cn(
                            "flex items-center p-2 rounded-md transition-colors group",
                            index !== uniquedReferences.length - 1 ? "mb-2" : "",
                            isLoading
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-muted/50 active:bg-muted/70"
                          )}>
                          <div
                            className={cn(
                              "flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors",
                              isLoading ? "bg-primary/5" : "bg-primary/10"
                            )}>
                            {isLoading ? (
                              <LoadingDots className="text-primary scale-75" />
                            ) : (
                              <FileTextIcon className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <span className="w-2 inline-block" />
                          <div className="flex-1 min-w-0 text-left">
                            <div className="text-sm truncate">
                              {index + 1}. {doc.document_name}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
      {/* 欢迎消息的推荐问题 */}
      {isWelcomeMessage && (
        <div className="flex -mt-3">
          <div className="w-[42px]" />
          <div className="flex-1">
            <div className="max-w-[88%]">
              <RecommendedQuestions onQuestionClick={onQuestionClick} />
            </div>
          </div>
        </div>
      )}
    </>

  );
}

export { Message };