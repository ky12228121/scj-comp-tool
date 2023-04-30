import {
  AppBar,
  Box,
  Button,
  Container,
  Unstable_Grid2 as Grid,
  Modal,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const style = {
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
const Header = () => {
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const navigate = useNavigate();
  const roomName = sessionStorage.getItem("room_name");
  const handleOpenExitModal = () => setExitModalOpen(true);
  const handleCloseExitModal = () => setExitModalOpen(false);
  const handleClickExitRoom = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    sessionStorage.removeItem("room_id");
    sessionStorage.removeItem("room_name");
    navigate("/");
    window.location.reload();
  };
  return (
    <Box>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Grid container spacing={2} display="flex" width="100%">
              <Grid xs>
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    mr: 2,
                    fontWeight: 500,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  SCJ大会ツール
                </Typography>
              </Grid>
              <Grid display="flex" justifyContent="flex-end" alignItems="center">
                <Typography variant="inherit">{"Room name:　"}</Typography>
                <Button
                  variant="text"
                  sx={{
                    textDecoration: "none",
                    textTransform: "none",
                    color: "white",
                    ":disabled": {
                      color: "white",
                    },
                  }}
                  onClick={handleOpenExitModal}
                  disabled={Boolean(!roomName)}
                >
                  <Typography variant="body1">{roomName || "None"}</Typography>
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={(theme) => theme.mixins.toolbar} />
      <Modal open={exitModalOpen} onClose={handleCloseExitModal}>
        <Paper sx={style}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Roomを退出しますか？
          </Typography>
          <Grid display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCloseExitModal}>
              キャンセル
            </Button>
            <Button variant="contained" sx={{ ml: 2 }} onClick={handleClickExitRoom}>
              退出
            </Button>
          </Grid>
        </Paper>
      </Modal>
      <Outlet />
    </Box>
  );
};

export default Header;
