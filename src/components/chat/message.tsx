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
const CustomButton = ({ url, className, children }: { url: string; className?: string; children: React.ReactNode }) => {


  const handleClick = () => {
    if (!url) return;
    window.location.href = url
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "bg-[#c2a168] text-xs text-white px-1.5 py-1 font-semibold rounded-md hover:bg-warm-brown-600 transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
};

// 缓存正则表达式
const buttonRegex = /<<BUTTON\|([^|]+)\|([^>]+)>>/;

// 提取按钮数据的函数
const extractButtons = (content: string) => {
  const buttons: { variant: 'primary' | 'secondary'; text: string; url: string }[] = [];
  let cleanContent = content;

  // 提取所有按钮并收集它们
  cleanContent = content.replace(buttonRegex, (_, url, text) => {
    buttons.push({ variant: 'primary', text, url });
    return ''; // 从内容中移除按钮标记
  });

  console.log('Extracted buttons:', cleanContent.trim());

  return { buttons, cleanContent: cleanContent.trim() };
};

// 消息内容组件
const MessageContent = memo(({ content }: { content: string }) => {
  // 使用 useMemo 缓存处理后的内容和按钮


  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ ...props }) => <p style={{ margin: 0 }} {...props} />,
        br: ({ ...props }) => <br style={{ display: 'none' }} {...props} />,
        a: ({ href, children }) => (
          <a
            href={href}
            rel="noopener noreferrer"
            className="text-warm-brown-600 break-all hover:text-warm-brown-800 underline"
          >
            {children}
          </a>
        )
      }}
    >
      {content}
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

  const { buttons, cleanContent } = useMemo(() => {
    return extractButtons(message.content);
  }, [message.content]);

  // const uniquedReferences = useMemo(() => {
  //   if (message.references?.chunks) {
  //     // 处理实时对话的引用格式
  //     const documents = new Map();
  //     message.references.chunks.forEach((chunk) => {
  //       if (!documents.has(chunk.document_id)) {
  //         documents.set(chunk.document_id, {
  //           document_id: chunk.document_id,
  //           document_name: chunk.document_name,
  //           dataset_id: chunk.dataset_id,
  //         });
  //       }
  //     });
  //     return Array.from(documents.values());
  //   } else if (message.reference) {
  //     // 处理历史消息的引用格式
  //     const documents = new Map();
  //     message.reference.forEach((ref) => {
  //       if (!documents.has(ref.document_id)) {
  //         documents.set(ref.document_id, {
  //           document_id: ref.document_id,
  //           document_name: ref.document_name,
  //           dataset_id: ref.dataset_id,
  //         });
  //       }
  //     });
  //     return Array.from(documents.values());
  //   }
  //   return [];
  // }, [message.reference, message.references?.chunks]);

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

  // const handlePreviewDocument = async (
  //   datasetId: string,
  //   documentId: string,
  //   fileName: string
  // ) => {
  //   try {

  //     // 使用已有的 downloadDocument API 获取文档
  //     const blob = await downloadDocument(datasetId, documentId, fileName);


  //     // 创建 blob URL
  //     const url = URL.createObjectURL(blob);

  //     // 使用 a 标签模拟点击，不限制文件类型
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = fileName;
  //     link.style.display = "none";

  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     // 清理对象URL
  //     setTimeout(() => URL.revokeObjectURL(url), 1000);
  //   } catch (error) {
  //     console.error("文档预览失败:", error);
  //     alert(
  //       `文档预览失败: ${error instanceof Error ? error.message : "未知错误"}`
  //     );
  //   }
  // };

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
                <div className="w-full text-sm leading-5 whitespace-pre-wrap break-words text-slate-900">

                  {isLoading ? (
                    <span className="inline-flex items-center text-nowrap">正在输入<img src={loadingGifSrc} className="w-5 mr-3" /></span>
                  ) : (
                    <MessageContent content={cleanContent} />
                  )}
                </div>
              </div>

              {/* 引用资料 */}
              {/* {uniquedReferences.length > 0 && (
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
              )} */}
            </div>
          </div>
        </div>
      </div>
      {/* 消息中的自定义按钮 */}
      {buttons.length > 0 && (
        <div className="flex -mt-3">
          <div className="w-[42px]" />
          <div className="flex-1">
            <div className="max-w-[88%]">
              <div className="bg-white px-3 py-2.5 text-sm rounded-md mb-6">
                <h4 className="mb-2">{t("chat.possibleApplications")}</h4>
                {buttons.map((button, index) => (
                  <div key={index} className={`flex justify-between px-3 py-2.5 bg-[#f7f4ef] rounded-md items-center ${index !== buttons.length - 1 ? "mb-2" : ""}`}>
                    <span className="font-semibold">
                      {button.text}
                    </span>
                    <CustomButton key={index} url={button.url}>
                      {t("chat.applyNow")}
                    </CustomButton>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
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