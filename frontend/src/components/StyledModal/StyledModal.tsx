import { Paper, Modal } from "@mui/material";
import { StyledModalProps } from "../../types";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  ":focus-visible": {
    outline: "none",
  },
};

export const StyledModal = (props: StyledModalProps) => {
  const { open, onClose } = props;
  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={modalStyle}>{props.children}</Paper>
    </Modal>
  );
};
