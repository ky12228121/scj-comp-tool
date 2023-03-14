import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./layouts/Header";
import Top from "./pages/Top";
import Check from "./pages/Check";
import Input from "./pages/Input";
import Entry from "./pages/Entry";
import { WebSocketProvider } from "./utils/provider";

const App = () => {
  const roomId = sessionStorage.getItem("room_id");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={roomId ? <Top /> : <Entry />} />
          <Route path="input" element={<Input />} />
          <Route
            path="check"
            element={
              <WebSocketProvider>
                <Check />
              </WebSocketProvider>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
