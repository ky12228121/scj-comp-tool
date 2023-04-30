import Alert from "@mui/material/Alert";
import MuiSnackbar from "@mui/material/Snackbar";
import { GlobalSnackbarProps } from "../../types";

export const Snackbar = (props: GlobalSnackbarProps) => {
  const { open, message, color, onClose } = props;
  return (
    <MuiSnackbar open={open} onClose={onClose} autoHideDuration={5000}>
      <Alert variant="filled" severity={color}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};
