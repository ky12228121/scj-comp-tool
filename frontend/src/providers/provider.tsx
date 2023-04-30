import { AlertColor } from "@mui/material/Alert";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { contexts } from ".";
import { Snackbar } from "../components/Snackbar";
import { useWebSocketCore } from "../hooks";
import { SnackbarContextType } from "../types";

export const SnackbarContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const context: SnackbarContextType = useContext(contexts.SnackbarContext);
  const [message, setMessage] = useState(context.message);
  const [color, setColor] = useState(context.color);

  const newContext: SnackbarContextType = useMemo(
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
  const handleClose = useCallback(() => {
    setMessage("");
  }, [setMessage]);

  return (
    <contexts.SnackbarContext.Provider value={newContext}>
      {children}
      <Snackbar
        open={newContext.message !== ""}
        message={newContext.message}
        color={newContext.color}
        onClose={handleClose}
      />
    </contexts.SnackbarContext.Provider>
  );
};

export const WebSocketProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [states, connecting] = useWebSocketCore();
  return (
    <contexts.WebSocketMessageContext.Provider value={states}>
      <contexts.WebSocketConnectingContext.Provider value={connecting}>
        {children}
      </contexts.WebSocketConnectingContext.Provider>
    </contexts.WebSocketMessageContext.Provider>
  );
};
