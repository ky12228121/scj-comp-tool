import { AlertColor } from "@mui/material/Alert";

export interface RoomTable {
  room_id: number;
  room_name: string;
  ttl: number;
}

export interface SnackbarContextType {
  message: string;
  color: AlertColor;
  showSnackbar: (message: string, color: AlertColor) => void;
}

export interface RoomIdProviderProps {
  children: React.ReactNode;
}

export interface GlobalSnackbarProps {
  open: boolean;
  message: string;
  color: AlertColor;
  onClose?: () => void;
}

export interface RecordType {
  id: string;
  first: number;
  second: number;
  third: number;
  forth: number;
  fifth: number;
  best: number;
  average: number;
  room_id?: number;
}

export interface InputTable {
  room_id?: number;
  scj_id: number;
  first: number;
  second: number;
  third: number;
  forth: number;
  fifth: number;
  best: number;
  average: number;
  ttl?: number;
}

export interface SocketMessageType extends InputTable {
  action: string;
}

export interface StyledModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
