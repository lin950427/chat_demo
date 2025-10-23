import { cn } from "@/lib/utils";
import type { Reference, ReferenceItem } from "@/lib/api/types";
import { LoadingDots } from "@/components/ui/loading-dots";
import { useTranslation } from "react-i18next";
import { RecommendedQuestions } from "./recommended-questions";
// import remarkGfm from 'remark-gfm'
import { memo, useMemo } from 'react'
import { CDN_PREFIX, DOCUMENT_BLACK_LIST } from "@/constant";
import Markdown from 'markdown-to-jsx'


// 按钮组件
const CustomButton = ({ url, className, children }: { url: string; className?: string; children: React.ReactNode }) => {

  return (
    <a
      href={url}
      rel="noreferrer"
      className={cn(
        "bg-[#c2a168] text-xs text-white px-1.5 py-1 font-semibold rounded-md hover:bg-warm-brown-600 transition-colors",
        className
      )}
    >
      {children}
    </a>
  );
};

// 缓存正则表达式，添加 g 标志进行全局匹配
const buttonRegex = /<<BUTTON\|([^|]+)\|([^>]+)>>/g;

// 提取按钮数据的函数
const extractButtons = (content: string) => {
  const buttons: { variant: 'primary' | 'secondary'; text: string; url: string }[] = [];
  let cleanContent = content;

  // 使用 matchAll 找出所有匹配项
  const matches = Array.from(content.matchAll(buttonRegex));

  // 收集所有按钮
  matches.forEach(([, url, text]) => {
    buttons.push({ variant: 'primary', text, url });
  });

  // 移除所有按钮标记
  cleanContent = content.replace(buttonRegex, '');

  // 移除所有未闭合的按钮标记（如内容结尾处残留的 <<BUTTON|... 或 <<BUTTON|...|...）
  cleanContent = cleanContent.replace(/<<BUTTON\|[^\n>]*/g, '');

  // 过滤掉 ##数字$$ 格式的字符
  cleanContent = cleanContent.replace(/##\d+\$\$/g, '');

  // 处理连续的换行符，将两个或更多连续的换行符替换为一个
  // cleanContent = cleanContent.replace(/\n/g, '\n');

  // 处理列表数字的转义
  cleanContent = cleanContent.replace(/(^|\n)(\d+)\.\s/g, '$1$2\\. ');

  return { buttons, cleanContent: cleanContent };
};

// 消息内容组件
const MessageContent = memo(({ content }: { content: string }) => {
  // return content

  return (
    <Markdown
      className='markdown-body'
      options={{
        overrides: {
          strong: (values) => {
            return <strong className="my-1 inline-block">{values.children}</strong>
          },
          hr: (values) => values.children || null,
        }
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

  const uniquedReferences = useMemo(() => {
    if (message.references?.chunks) {
      // 处理实时对话的引用格式
      const documents = new Map();
      // document_id相同文件也不一样 所以暂时用 document_name 作为 key
      message.references.chunks.forEach((chunk) => {
        if (DOCUMENT_BLACK_LIST.includes(chunk.document_id)) {
          return;
        }
        if (!documents.has(`${chunk.dataset_id}-${chunk.document_name}`)) {
          documents.set(`${chunk.dataset_id}-${chunk.document_name}`, {
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
        if (DOCUMENT_BLACK_LIST.includes(ref.document_id)) {
          return;
        }
        if (!documents.has(`${ref.dataset_id}-${ref.document_name}`)) {
          documents.set(`${ref.dataset_id}-${ref.document_name}`, {
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
            "flex flex-col rounded-md px-3 py-2.5 max-w-[calc(100vw-56px-50px)] bg-[#E7DFCF]"
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
                "flex flex-col rounded-md overflow-hidden max-w-[calc(100vw-56px-50px)] bg-white transition-opacity duration-200",
              )}>
              {/* 消息内容 */}
              <div className="px-3 py-2.5">
                <div className="w-full text-sm break-words whitespace-pre-wrap leading-[1.5] text-slate-900">

                  {isLoading ? (
                    <span className="inline-flex items-center text-nowrap">{t("chat.typing")}<img src={loadingGifSrc} className="w-5 mr-3 ml-0.5 -mb-1" /></span>
                  ) : (
                    <MessageContent content={cleanContent} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 引用资料 */}
      {uniquedReferences.length > 0 && (
        <div className="flex -mt-3">
          <div className="w-[42px]" />
          <div className="flex-1">
            <div className="max-w-[calc(100vw-56px-50px)]">
              <div className="bg-white px-3 pt-2.5 pb-0.5 text-sm rounded-md mb-6">
                <h4 className="mb-2">{t("chat.relatedDocuments")}</h4>
                <div className="flex flex-col">
                  {uniquedReferences.map((doc) => (
                    <a
                      key={doc.document_id}
                      // onClick={() =>
                      //   handlePreviewDocument(
                      //     doc.dataset_id,
                      //     doc.document_id,
                      //     doc.document_name
                      //   )
                      // }
                      // disabled={isLoading}
                      // className={cn(
                      //   "flex items-center p-2 rounded-md transition-colors group",
                      //   index !== uniquedReferences.length - 1 ? "mb-2" : "",
                      //   isLoading
                      //     ? "opacity-50 cursor-not-allowed"
                      //     : "hover:bg-muted/50 active:bg-muted/70"
                      // )}
                      href={`${CDN_PREFIX}/${doc.document_name}`}
                      className="bg-[#EAE4D766] px-3 py-2 rounded-md flex items-center mb-2"
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors",
                          isLoading ? "bg-primary/5" : ''
                        )}>
                        {isLoading ? (
                          <LoadingDots className="text-primary scale-75" />
                        ) : (
                          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.2336 1.33185H5.29905C4.34122 1.33185 3.5741 2.10764 3.5741 3.06547L3.56543 16.9345C3.56543 17.8923 4.33257 18.6681 5.29038 18.6681H15.7008C16.6587 18.6681 17.4344 17.8923 17.4344 16.9345V6.53274L12.2336 1.33185ZM13.9672 15.2009H7.03268V13.4672H13.9672V15.2009ZM13.9672 11.7336H7.03268V9.99999H13.9672V11.7336ZM11.3668 7.39955V2.63207L16.1342 7.39955H11.3668Z" fill="#C2A168" />
                          </svg>

                        )}
                      </div>
                      <span className="w-2 inline-block" />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-xs font-semibold truncate">
                          {doc.document_name}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      {/* 消息中的自定义按钮 */}
      {buttons.length > 0 && (
        <div className="flex -mt-3">
          <div className="w-[42px]" />
          <div className="flex-1">
            <div className="max-w-[calc(100vw-56px-50px)]">
              <div className="bg-white px-3 py-2.5 text-sm rounded-md mb-6">
                {/* <h4 className="mb-2">{t("chat.possibleApplications")}</h4> */}
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
            <div className="max-w-[calc(100vw-56px-50px)]">
              <RecommendedQuestions onQuestionClick={onQuestionClick} />
            </div>
          </div>
        </div>
      )}
    </>

  );
}

export { Message };