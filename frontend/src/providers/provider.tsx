import React from "react";
import { SnackbarContext, WebSocketConnectingContext, WebSocketMessageContext } from "./context";
import { GlobalSnackbar } from "../components/Snackbar/Snackbar";
import { SnackbarContextType } from "../types";
import { AlertColor } from "@mui/material/Alert";
import { useWebSocketCore } from "../hooks/hook";

export const SnackbarContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const context: SnackbarContextType = React.useContext(SnackbarContext);
  const [message, setMessage] = React.useState(context.message);
  const [color, setColor] = React.useState(context.color);

  const newContext: SnackbarContextType = React.useMemo(
    () => ({
      message,
      color,
      showSnackbar: (message: string, color: AlertColor) => {
        setMessage(message);
        setColor(color);
      },
    }),
    [message, color, setMessage, setColor]
  );

  // スナックバーを閉じるためのハンドラー関数
  const handleClose = React.useCallback(() => {
    setMessage("");
  }, [setMessage]);

  return (
    <SnackbarContext.Provider value={newContext}>
      {children}
      <GlobalSnackbar
        open={newContext.message !== ""}
        message={newContext.message}
        color={newContext.color}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  );
};

export const WebSocketProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [states, connecting] = useWebSocketCore();
  return (
    <WebSocketMessageContext.Provider value={states}>
      <WebSocketConnectingContext.Provider value={connecting}>
        {children}
      </WebSocketConnectingContext.Provider>
    </WebSocketMessageContext.Provider>
  );
};
