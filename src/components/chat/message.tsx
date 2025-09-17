import { cn } from "@/lib/utils";
import { FileTextIcon } from "@radix-ui/react-icons";
import type { Reference, ReferenceItem } from "@/lib/api/types";
import { downloadDocument } from "@/lib/api/chat";
import { LoadingDots } from "@/components/ui/loading-dots";
import { useTranslation } from "react-i18next";

interface MessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
    references?: Reference;
    reference?: ReferenceItem[];
  };
  className?: string;
  isLoading?: boolean;
}
export function Message({ message, className, isLoading }: MessageProps) {
  const { t } = useTranslation();
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className={cn("flex w-full justify-end mb-4", className)}>
        <div
          className={cn(
            "flex flex-col gap-2 rounded-xl px-4 py-2 max-w-[85%] bg-primary text-primary-foreground"
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
      console.log("开始预览文档:", { datasetId, documentId, fileName });

      // 使用已有的 downloadDocument API 获取文档
      const blob = await downloadDocument(datasetId, documentId, fileName);

      console.log("文档下载成功:", { type: blob.type, size: blob.size });

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

  // 从引用中获取不重复的文档列表
  const getUniqueDocuments = () => {
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
  };
  return (
    <div className={cn("flex w-full flex-col mb-4", className)}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span>助手回复：</span>
        {isLoading && <LoadingDots className="text-primary" />}
      </div>
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            "flex flex-col rounded-xl overflow-hidden max-w-[85%] bg-white border border-slate-200 transition-opacity duration-200",
            isLoading && "animate-pulse"
          )}>
          {/* 消息内容 */}
          <div className="px-4 py-2">
            <div className="text-sm whitespace-pre-wrap break-words text-slate-900">
              {message.content}
            </div>
          </div>

          {/* 引用资料 */}
          {getUniqueDocuments().length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50">
              <div className="p-3">
                <div className="text-xs text-slate-600 mb-2">
                  {t("chat.references.summary", {
                    count: getUniqueDocuments().length,
                  })}
                </div>
                <div className="flex flex-col gap-2">
                  {getUniqueDocuments().map((doc, index) => (
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
                        "flex items-center gap-2 p-2 rounded-md transition-colors group",
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
  );
}
