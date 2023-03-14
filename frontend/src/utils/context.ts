import { AlertColor } from "@mui/material";
import React from "react";
import { InputTable, SnackbarContextType } from "./types";

export const SnackbarContext = React.createContext<SnackbarContextType>({
  message: "",
  color: "success",
  showSnackbar: (_message: string, _color: AlertColor) => {
    console.log(_message, _color);
  },
});

export const WebSocketMessageContext = React.createContext<InputTable | null>(null);
export const WebSocketConnectingContext = React.createContext(false);
