import { createBrowserRouter } from "react-router-dom";
import Header from "./layouts/Header";
import Top from "./pages/Top";
import Check from "./pages/Check";
import Input from "./pages/Input";
import Entry from "./pages/Entry";
import { providers } from "./providers";

const roomId = sessionStorage.getItem("room_id");
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        index: true,
        element: roomId ? <Top /> : <Entry />,
      },
      {
        path: "input",
        element: <Input />,
      },
      {
        path: "check",
        element: (
          <providers.WebSocketProvider>
            <Check />
          </providers.WebSocketProvider>
        ),
      },
    ],
  },
]);
