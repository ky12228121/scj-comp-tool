import {
  Button,
  Container,
  FormControl,
  Unstable_Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { WideButton } from "../components/WideButton";
import { useInput, useSnackbar } from "../hooks";
import { RoomTable } from "../types";
import { StyledModal } from "../components/StyledModal";

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
            <WideButton variant="outlined" onClick={handleOpenCreateModal}>
              <Typography variant="h5">Roomを作成する</Typography>
            </WideButton>
          </Grid>
          <Grid display="flex" justifyContent="center" xs={6}>
            <WideButton variant="outlined" onClick={handleOpenEntryModal}>
              <Typography variant="h5">Roomに参加する</Typography>
            </WideButton>
          </Grid>
        </Grid>
      </Container>
      <StyledModal open={createModalOpen} onClose={handleCloseCreateModal}>
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
          <Button variant="outlined" onClick={handleCloseCreateModal}>
            キャンセル
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleClickCreateRoom}>
            作成
          </Button>
        </Grid>
      </StyledModal>
      <StyledModal open={entryModalOpen} onClose={handleCloseEntryModal}>
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
          <Button variant="outlined" onClick={handleCloseEntryModal}>
            キャンセル
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleClickEntryRoom}>
            参加
          </Button>
        </Grid>
      </StyledModal>
    </>
  );
};

export default Entry;
