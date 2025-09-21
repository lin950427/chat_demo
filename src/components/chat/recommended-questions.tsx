import { useState } from "react";
import { useTranslation } from "react-i18next";

interface RecommendedQuestionsProps {
  onQuestionClick?: (question: string) => void;
}

export function RecommendedQuestions({ onQuestionClick }: RecommendedQuestionsProps) {
  const { t } = useTranslation();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  console.log(setCurrentGroupIndex)

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
//   const handleRefreshQuestions = () => {
//     setCurrentGroupIndex((prev) => (prev + 1) % questionGroups.length);
//   };

  return (
    <div className="max-w-full">
      {/* <p className="text-sm text-warm-brown-600 mb-3">
        {t("chat.welcome.tryAsk")}
      </p> */}
      <div className="flex flex-col gap-2 mb-4">
        {currentQuestions.map((question: string, index: number) => (
          <button
            key={`${currentGroupIndex}-${index}`}
            onClick={() => onQuestionClick?.(question)}
            className="flex items-center justify-center text-left text-xs leading-5 text-[#CBB486] px-4 py-2 rounded-md bg-white hover:bg-warm-brown-100 border border-[#CBB486] font-semibold transition-colors">
            <span>{question}</span>
            {/* <svg
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
            </svg> */}
          </button>
        ))}
      </div>

      {/* <div className="flex justify-center">
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
      </div> */}
    </div>
  );
}