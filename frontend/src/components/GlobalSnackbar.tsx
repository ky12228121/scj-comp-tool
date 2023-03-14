import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { GlobalSnackbarProps } from '../utils/types';


export const GlobalSnackbar = (props: GlobalSnackbarProps) => {
  const { open, message, color, onClose } = props;
  return (
    <Snackbar open={open} onClose={onClose} autoHideDuration={5000}>
      <Alert variant="filled" severity={color}>
        {message}
      </Alert>
    </Snackbar>
  );
};
