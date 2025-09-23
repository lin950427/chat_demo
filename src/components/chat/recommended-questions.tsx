import { getQuestions } from "@/lib/api/question";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface RecommendedQuestionsProps {
  onQuestionClick?: (question: string) => void;
}

export function RecommendedQuestions({ onQuestionClick }: RecommendedQuestionsProps) {

  const { i18n } = useTranslation()
  const isZH = i18n.language === "zh-CN"
  const { data: questionsInfo } = useSWR(['getQuestions'], getQuestions);

  const questions = useMemo(() => questionsInfo?.part1 || [], [questionsInfo])

  return (
    <div className="max-w-full">
      <div className="flex flex-col mb-4">
        {questions.map((question, index: number) => (
          <button
            key={`${index}`}
            onClick={() => onQuestionClick?.(isZH ? question.zh : question.en)}
            className={`flex items-center justify-center text-left text-xs leading-5 text-[#CBB486] px-4 py-2 rounded-md bg-white hover:bg-warm-brown-100 border border-[#CBB486] font-semibold transition-colors ${index !== questions.length - 1 ? "mb-2" : ""}`}>
            <span>{isZH ? question.zh : question.en}</span>
          </button>
        ))}
      </div>
    </div>
  );
}