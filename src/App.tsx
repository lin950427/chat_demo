// import { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import ChatPage from "./pages/chat";
import { FakeLink } from "./pages/fake-link";
import { useAuth } from "./hooks/useAuth";
import "./i18n";
import { SWRConfig } from "swr";
import { swrConfig } from "./lib/swr-config";
import { FakeLinkB } from "./pages/fake-link-b";
import { FakeLinkC } from "./pages/fake-link-c";
import { FakeLinkD } from "./pages/fake-link-d";
import { FakeLinkA } from "./pages/fake-link-a";
// import { useEffect } from "react";
// import { initVConsole } from "./lib/debug";


function App() {
  // useEffect(() => {
  //   // 初始化调试工具
  //   initVConsole();
  //   console.log("当前路由", window.location.href);
  // }, []);

  const { isAuthenticated, isLoading } = useAuth();



  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SWRConfig value={swrConfig}>
      <HashRouter>
        <div className="h-screen w-full overflow-hidden">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/fake-link" element={<FakeLink />} />
            <Route path="/fake-link-a" element={<FakeLinkA />} />
            <Route path="/fake-link-b" element={<FakeLinkB />} />
            <Route path="/fake-link-c" element={<FakeLinkC />} />
            <Route path="/fake-link-d" element={<FakeLinkD />} />
            <Route path="/" element={<Navigate to="/fake-link-a" />} />
            <Route path="*" element={<Navigate to="/fake-link-a" />} />
          </Routes>
        </div>
      </HashRouter>
    </SWRConfig>
  );
}

export default App;
