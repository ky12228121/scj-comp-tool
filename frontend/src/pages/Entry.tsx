import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { StyledButton } from "../components/StyledButton";
import Modal from "@mui/material/Modal";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import axios from "axios";
import { useInput, useSnackbar } from "../utils/hook";
import { RoomTable } from "../utils/types";

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

const Entry = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [roomList, setRoomList] = useState<RoomTable[]>([]);
  const [selectRoom, setSelectRoom] = useState("");
  const {
    value: inputRoomName,
    setValue: setInputRoomName,
    resetValue: resetInputRoomName,
  } = useInput("");
  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);
  const handleOpenEntryModal = () => setEntryModalOpen(true);
  const handleCloseEntryModal = () => setEntryModalOpen(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/room/get`).then((res) => {
      setRoomList(res.data);
    });
  }, []);
  const handleClickCreateRoom = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/room/create?room_name=${inputRoomName}`)
      .then((res) => {
        sessionStorage.setItem("room_id", String(res.data.room_id));
        sessionStorage.setItem("room_name", res.data.room_name);
        showSnackbar("Success!", "success");
        window.location.reload();
      })
      .catch(() => {
        showSnackbar("Failed!", "error");
      })
      .finally(() => {
        resetInput();
      });
  };
  const handleClickEntryRoom = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const selectedRoom = roomList.find((room) => room.room_id === Number(selectRoom));
    if (selectedRoom) {
      sessionStorage.setItem("room_id", String(selectedRoom.room_id));
      sessionStorage.setItem("room_name", selectedRoom.room_name);
      window.location.reload();
    }
  };
  const handleChangeRoom = (event: SelectChangeEvent) => {
    event.preventDefault();
    setSelectRoom(event.target.value);
  };
  const resetInput = () => {
    resetInputRoomName();
  };
  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid display="flex" justifyContent="center" xs={6}>
            <StyledButton variant="outlined" onClick={handleOpenCreateModal}>
              <Typography variant="h5">Roomを作成する</Typography>
            </StyledButton>
          </Grid>
          <Grid display="flex" justifyContent="center" xs={6}>
            <StyledButton variant="outlined" onClick={handleOpenEntryModal}>
              <Typography variant="h5">Roomに参加する</Typography>
            </StyledButton>
          </Grid>
        </Grid>
      </Container>
      <Modal open={createModalOpen} onClose={handleCloseCreateModal}>
        <Paper sx={style}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Room名を入力してください
          </Typography>
          <TextField
            label="Room名"
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
            value={inputRoomName}
            onChange={setInputRoomName}
          />
          <Grid display="flex" justifyContent="flex-end">
            <Button variant="contained" color="inherit" onClick={handleCloseCreateModal}>
              キャンセル
            </Button>
            <Button variant="contained" sx={{ ml: 2 }} onClick={handleClickCreateRoom}>
              作成
            </Button>
          </Grid>
        </Paper>
      </Modal>
      <Modal open={entryModalOpen} onClose={handleCloseEntryModal}>
        <Paper sx={style}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Roomを選択してください
          </Typography>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="select-label">Room</InputLabel>
            <Select
              labelId="select-label"
              value={selectRoom}
              label="Room"
              onChange={handleChangeRoom}
            >
              {roomList.map((room) => (
                <MenuItem value={room.room_id} key={room.room_id}>
                  {room.room_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid display="flex" justifyContent="flex-end">
            <Button variant="contained" color="inherit" onClick={handleCloseEntryModal}>
              キャンセル
            </Button>
            <Button variant="contained" sx={{ ml: 2 }} onClick={handleClickEntryRoom}>
              参加
            </Button>
          </Grid>
        </Paper>
      </Modal>
    </>
  );
};

export default Entry;
