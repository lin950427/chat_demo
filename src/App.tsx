// import { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import ChatPage from "./pages/chat";
import { useAuth } from "./hooks/useAuth";
import "./i18n";
import { SWRConfig } from "swr";
import { swrConfig } from "./lib/swr-config";
import { useEffect } from "react";
import { initVConsole } from "./lib/debug";


function App() {
  useEffect(() => {
    // 初始化调试工具
    initVConsole();
    console.log("当前路由", window.location.href);
  }, []);

  const { isAuthenticated, isLoading, userId } = useAuth();


  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  // const userId = undefined

  return (
    <SWRConfig value={swrConfig}>
      <HashRouter>
        <div className="h-screen w-full overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage userId={String(userId)} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </HashRouter>
    </SWRConfig>
  );
}

export default App;
