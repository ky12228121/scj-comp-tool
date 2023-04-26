import { SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { contexts } from "../providers";
import { SocketMessageType } from "../types";

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  const handleChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  }, []);
  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, []);
  return { value, setValue: handleChangeInput, resetValue };
};

export const useSelect = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  const handleChangeInput = useCallback((e: SelectChangeEvent) => {
    e.preventDefault();
    setValue(e.target.value as string);
  }, []);
  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, []);
  return { value, setValue: handleChangeInput, resetValue };
};

export const useSnackbar = () => {
  return useContext(contexts.SnackbarContext);
};

export const useWebSocketCore: () => [SocketMessageType | null, boolean] = () => {
  const [lastMessage, setLastMessage] = useState<SocketMessageType | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const connecting = useRef(true);
  useEffect(() => {
    if (process.env.REACT_APP_WEBSOCKET_ENDPOINT) {
      webSocketRef.current = new WebSocket(
        `${process.env.REACT_APP_WEBSOCKET_ENDPOINT}?room_id=${sessionStorage.getItem("room_id")}`
      );
    }
    if (!webSocketRef.current) {
      throw new Error("WebSocket failed to be created");
    }
    const start = () => {
      if (!webSocketRef.current) return;
      webSocketRef.current.addEventListener("message", (event) => {
        setLastMessage(JSON.parse(event.data));
      });
    };
    start();
    connecting.current = false;
    return () => {
      webSocketRef.current?.close();
      connecting.current = true;
      setLastMessage(null);
    };
  }, []);
  return [lastMessage, connecting.current];
};
