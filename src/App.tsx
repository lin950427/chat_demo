import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/home";
import ChatPage from "./pages/chat";
import { FakeLink } from "./pages/fake-link";
import { useAuth } from "./hooks/useAuth";
import "./i18n";
import { SWRConfig } from "swr";
import { swrConfig } from "./lib/swr-config";
import { initVConsole } from "./lib/debug";


function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // useEffect(() => {
  //   // 初始化调试工具
  //   initVConsole();
  // }, []);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const base = import.meta.env.BASE_URL || "/";
  const basename = base.replace(/\/$/, "");

  return (
    <SWRConfig value={swrConfig}>
      <BrowserRouter basename={basename}>
        <div className="h-screen w-full overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/fake-link" element={<FakeLink />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SWRConfig>
  );
}

export default App;
