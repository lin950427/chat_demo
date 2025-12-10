import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import ChatPage from "./pages/chat";
import Disclaimer from "./pages/disclaimer";
import ServiceAgreement from "./pages/service-agreement";
import "./i18n";
import { SWRConfig } from "swr";
import { swrConfig } from "./lib/swr-config";



function App() {

  return (
    <SWRConfig value={swrConfig}>
      <HashRouter>
        <div className="h-screen w-full overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage userId={undefined} />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/service-agreement" element={<ServiceAgreement />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </HashRouter>
    </SWRConfig>
  );
}

export default App;
