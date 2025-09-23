import { useState, useEffect } from "react";
import { Home } from "./pages/home";
import ChatPage from "./pages/chat";
import { useAuth } from "./hooks/useAuth";
import "./i18n";
import { LANGUAGE_KEY } from "./constant";
import { SWRConfig } from "swr";
import { swrConfig } from "./lib/swr-config";
import { initVConsole } from "./lib/debug";


function App() {
  const { isAuthenticated, isLoading, userId } = useAuth();

  // useEffect(() => {
  //   // 初始化调试工具
  //   initVConsole();
  // }, []);

  // 同步初始化状态，避免闪烁
  const [currentPage, setCurrentPage] = useState<"home" | "chat" | "loading">(
    () => {
      try {
        const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
        return savedLanguage ? "chat" : "home";
      } catch {
        return "home";
      }
    }
  );

  const handleLanguageSelect = (language: string) => {
    localStorage.setItem(LANGUAGE_KEY, language);
    setCurrentPage("chat");
  };

  // 如果还在认证中，显示认证页面
  if (!isAuthenticated || isLoading) {
    return null;
  }


  return (
    <SWRConfig value={swrConfig}>
      {currentPage === "home" ? (
        <Home onLanguageSelect={handleLanguageSelect} />
      ) : (
        <ChatPage userId={userId} />
      )}
    </SWRConfig>
  );
}

export default App;
