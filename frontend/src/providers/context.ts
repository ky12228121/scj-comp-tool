import { AlertColor } from "@mui/material";
import { createContext } from "react";
import { SnackbarContextType, SocketMessageType } from "../types";

export const SnackbarContext = createContext<SnackbarContextType>({
  message: "",
  color: "success",
  showSnackbar: (_message: string, _color: AlertColor) => {
    void 0;
  },
});

export const WebSocketMessageContext = createContext<SocketMessageType | null>(null);
export const WebSocketConnectingContext = createContext(false);
