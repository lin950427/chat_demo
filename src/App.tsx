import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./pages/home";
import ChatPage from "./pages/chat";
import "./i18n";
import { LANGUAGE_KEY } from "./constant";

const queryClient = new QueryClient();

function App() {
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

  return (
    <QueryClientProvider client={queryClient}>
      {currentPage === "home" ? (
        <Home onLanguageSelect={handleLanguageSelect} />
      ) : (
        <ChatPage />
      )}
    </QueryClientProvider>
  );
}

export default App;
