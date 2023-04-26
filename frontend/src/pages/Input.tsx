import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Unstable_Grid2 as Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useInput, useSelect, useSnackbar } from "../hooks";
import { InputTable, RecordType } from "../types";
import {
  convertTimeIntToTimeString,
  convertTimeIntToTimeStringForCopy,
  convertTimeStringToTimeInt,
} from "../utils/convert";
import { constants } from "../variables";

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

const Input = () => {
  const [scjId, setScjId] = useState("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [value4, setValue4] = useState("");
  const [value5, setValue5] = useState("");
  const [record, setRecord] = useState<RecordType[]>([]);
  const [copyModalOpened, setCopyModalOpened] = useState(false);
  const { value: inputCompId, setValue: setInputCompId } = useInput("");
  const { value: selectEvent, setValue: setSelectEvent } = useSelect("");
  const { value: selectRound, setValue: setSelectRound } = useSelect("");

  const [allDeleteDialogOpened, setAllDeleteDialogOpened] = useState(false);

  const scjIdRef = useRef<HTMLInputElement>(null);
  const input1 = useRef<HTMLInputElement>(null);
  const input2 = useRef<HTMLInputElement>(null);
  const input3 = useRef<HTMLInputElement>(null);
  const input4 = useRef<HTMLInputElement>(null);
  const input5 = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { showSnackbar } = useSnackbar();
  const { DNF, DNF_FOR_CALC, DNS, DNS_FOR_CALC } = constants;
  const refList = [scjIdRef, input1, input2, input3, input4, input5, buttonRef];

  const handleOpenCopyModal = () => setCopyModalOpened(true);
  const handleCloseCopyModal = () => setCopyModalOpened(false);
  const handleOpenAllDeleteDialog = () => setAllDeleteDialogOpened(true);
  const handleCloseAllDeleteDialog = () => setAllDeleteDialogOpened(false);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/input/get?room_id=${sessionStorage.getItem(
          "room_id"
        )}`
      )
      .then((res) => {
        const recordList = res.data.map((data: InputTable) => {
          const newRecord: RecordType = {
            ...data,
            id: String(data.scj_id),
          };
          delete newRecord.room_id;
          return newRecord;
        });
        setRecord(recordList);
      });
  }, []);

  const formatValue = (value: string) => {
    let numeric = value.replace(/[.:]/g, "");
    if (numeric[0] === "0") numeric = numeric.slice(1);
    if (numeric === "") return "";
    else if (numeric.length === 1) return numeric;
    else if (numeric.length === 2) return `0.${numeric}`;
    else if (numeric.length <= 4) {
      const pre = numeric.slice(0, -2);
      const last2 = numeric.slice(-2);
      return `${pre}.${last2}`;
    } else if (numeric.length <= 6) {
      const pre = numeric.slice(0, -4);
      const center2 = numeric.slice(-4, -2);
      const last2 = numeric.slice(-2);
      return `${pre}:${center2}.${last2}`;
    } else return value;
  };

  const handleChangeIdInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.match(/^[0-9]*$/g)) setScjId(e.target.value);
  };

  const handleChangeTimeInput = (
    e: ChangeEvent<HTMLInputElement>,
    callback: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const targetValue = e.target.value;
    if (targetValue.indexOf("-") !== -1) {
      if (targetValue === "-" || targetValue === "-1" || targetValue === "-2") {
        callback(targetValue);
        return;
      }
      if (targetValue.length >= 3) {
        callback(targetValue.substring(0, 2));
        return;
      }
      return;
    }

    const numeric = targetValue.replace(".", "").replace(":", "");
    let inputValue = targetValue;
    if (targetValue.length > 8) return;
    if (isNaN(Number(numeric))) inputValue = "";
    callback(formatValue(inputValue));
  };

  const nextFocus = () => {
    const index = refList.findIndex((element) => element.current === document.activeElement);
    if (index !== 6) refList[index + 1].current?.focus();
  };
  const backFocus = () => {
    const index = refList.findIndex((element) => element.current === document.activeElement);
    if (index !== 0) refList[index + -1].current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLButtonElement>) => {
    if (e.code !== "Enter") return;
    if (e.shiftKey) backFocus();
    else nextFocus();
  };

  const formatedTimeList = () => {
    const num1 = convertTimeStringToTimeInt(value1, true);
    const num2 = convertTimeStringToTimeInt(value2, true);
    const num3 = convertTimeStringToTimeInt(value3, true);
    const num4 = convertTimeStringToTimeInt(value4, true);
    const num5 = convertTimeStringToTimeInt(value5, true);
    return [num1, num2, num3, num4, num5];
  };
  const calcBest = () => {
    const best = Math.min(...formatedTimeList());
    if (best === DNS) return DNS;
    else if (best === DNF) return DNF;
    else return best;
  };
  const calcAverage = () => {
    const sorted = formatedTimeList().sort((a: number, b: number) => a - b);
    if (sorted[3] === DNF_FOR_CALC) return DNF;
    if (sorted[3] === DNS_FOR_CALC) return DNS;
    sorted.shift();
    sorted.pop();

    const reducer = (
      accumulator: number,
      currentValue: number,
      _: number,
      { length }: { length: number }
    ) => accumulator + currentValue / length;
    const avg = sorted.reduce(reducer, 0);
    return Math.round(Math.round(avg / 10) * 10);
  };

  const registerRecord = () => {
    const best = calcBest();
    const average = calcAverage();
    const newRecord = {
      id: scjId,
      first: convertTimeStringToTimeInt(value1),
      second: convertTimeStringToTimeInt(value2),
      third: convertTimeStringToTimeInt(value3),
      forth: convertTimeStringToTimeInt(value4),
      fifth: convertTimeStringToTimeInt(value5),
      best: best,
      average: average,
    };
    const postParams = {
      ...newRecord,
      room_id: Number(sessionStorage.getItem("room_id")),
      scj_id: Number(scjId),
    };
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/input/register`, postParams)
      .then(() => {
        clearInput();
        setRecord((prev) => [...prev, newRecord]);
      })
      .catch(() => showSnackbar("Failed!", "error"));
  };
  const clearInput = () => {
    setScjId("");
    setValue1("");
    setValue2("");
    setValue3("");
    setValue4("");
    setValue5("");
    scjIdRef.current?.focus();
  };
  const handleClickEdit = (id: string) => {
    const editRecord = record.find((rec) => rec.id === id);
    if (editRecord) {
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/input/delete?room_id=${sessionStorage.getItem(
            "room_id"
          )}&scj_id=${id}`
        )
        .then(() => {
          setScjId(editRecord.id);
          setValue1(convertTimeIntToTimeString(editRecord.first, true));
          setValue2(convertTimeIntToTimeString(editRecord.second, true));
          setValue3(convertTimeIntToTimeString(editRecord.third, true));
          setValue4(convertTimeIntToTimeString(editRecord.forth, true));
          setValue5(convertTimeIntToTimeString(editRecord.fifth, true));
          scjIdRef.current?.focus();
          const newRecord = record.filter((rec) => rec.id !== id);
          setRecord(newRecord);
        })
        .catch(() => showSnackbar("Failed", "error"));
    }
  };
  const handleClickDelete = (id: string) => {
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/input/delete?room_id=${sessionStorage.getItem(
          "room_id"
        )}&scj_id=${id}`
      )
      .then(() => {
        const newRecord = record.filter((rec) => rec.id !== id);
        setRecord(newRecord);
      })
      .catch(() => showSnackbar("Failed!", "error"));
  };
  const handleClickAllDelete = () => handleOpenAllDeleteDialog();
  const allDelete = () => {
    const param = { id_list: record.map((rec) => rec.id) };
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/input/delete?room_id=${sessionStorage.getItem(
          "room_id"
        )}&scj_id=all`,
        param
      )
      .then(() => {
        setRecord([]);
        handleCloseAllDeleteDialog();
      })
      .catch(() => showSnackbar("Failed!", "error"));
  };
  const handleClickCopy = () => handleOpenCopyModal();
  const copy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let sortedRecord = [...record]
      .sort((a, b) => a.average - b.average)
      .filter((rec) => rec.average >= 0);
    const negativeRecord = record.filter((rec) => rec.average < 0);
    negativeRecord.sort((a, b) => b.average - a.average);
    sortedRecord = [...sortedRecord, ...negativeRecord];
    const row = sortedRecord.map((rec, index) => {
      const dataList = [];
      dataList.push(inputCompId);
      dataList.push(selectEvent);
      dataList.push(rec.id);
      dataList.push(selectRound);
      dataList.push(index + 1);
      dataList.push(convertTimeIntToTimeStringForCopy(rec.best));
      dataList.push(convertTimeIntToTimeStringForCopy(rec.average));
      dataList.push(convertTimeIntToTimeStringForCopy(rec.first));
      dataList.push(convertTimeIntToTimeStringForCopy(rec.second));
      dataList.push(convertTimeIntToTimeStringForCopy(rec.third));
      dataList.push(convertTimeIntToTimeStringForCopy(rec.forth));
      dataList.push(convertTimeIntToTimeStringForCopy(rec.fifth));
      return dataList.join("\t");
    });
    navigator.clipboard.writeText(row.join("\n"));
    showSnackbar("Copied!", "success");
    setCopyModalOpened(false);
  };
  return (
    <>
      <Container>
        <Grid container sx={{ mb: 2, mt: 5 }}>
          <Grid xs={12}>
            <TableContainer
              component={Paper}
              sx={{ maxWidth: "100%", height: "60vh", bg: "#e5e5e5" }}
            >
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">1st</TableCell>
                    <TableCell align="center">2nd</TableCell>
                    <TableCell align="center">3rd</TableCell>
                    <TableCell align="center">4th</TableCell>
                    <TableCell align="center">5th</TableCell>
                    <TableCell align="center">Best</TableCell>
                    <TableCell align="center">Avg.</TableCell>
                    <TableCell align="center" colSpan={2} sx={{ width: "5%" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {record.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell align="center" sx={{ backgroundColor: "#F0F0F0" }}>
                        {rec.id}
                      </TableCell>
                      <TableCell align="center">{convertTimeIntToTimeString(rec.first)}</TableCell>
                      <TableCell align="center">{convertTimeIntToTimeString(rec.second)}</TableCell>
                      <TableCell align="center">{convertTimeIntToTimeString(rec.third)}</TableCell>
                      <TableCell align="center">{convertTimeIntToTimeString(rec.forth)}</TableCell>
                      <TableCell align="center">{convertTimeIntToTimeString(rec.fifth)}</TableCell>
                      <TableCell align="center" sx={{ backgroundColor: "#F0FFF0" }}>
                        {convertTimeIntToTimeString(rec.best)}
                      </TableCell>
                      <TableCell align="center" sx={{ backgroundColor: "#F0FFF0" }}>
                        {convertTimeIntToTimeString(rec.average)}
                      </TableCell>
                      <TableCell align="center" sx={{ backgroundColor: "#FFE4E1" }}>
                        <IconButton onClick={() => handleClickEdit(rec.id)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center" sx={{ backgroundColor: "#FFE4E1" }}>
                        <IconButton onClick={() => handleClickDelete(rec.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid container display="flex" justifyContent="flex-end" spacing={2} sx={{ mb: 5 }}>
          <Grid xs={2}>
            <Button
              variant="contained"
              sx={{ width: "100%", py: 1 }}
              color="error"
              onClick={handleClickAllDelete}
            >
              全削除する
            </Button>
          </Grid>
          <Grid xs={2}>
            <Button
              variant="contained"
              sx={{ width: "100%", py: 1 }}
              color="info"
              onClick={handleClickCopy}
            >
              コピーする
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid display="flex" justifyContent="space-between">
            <Grid xs={1}>
              <TextField
                autoFocus
                variant="outlined"
                label="SCJ ID"
                InputLabelProps={{
                  shrink: true,
                }}
                value={scjId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeIdInput(e)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
                inputRef={scjIdRef}
              />
            </Grid>
            <Grid xs={2}>
              <TextField
                variant="outlined"
                label="1st"
                InputLabelProps={{
                  shrink: true,
                }}
                value={value1}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTimeInput(e, setValue1)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
                inputRef={input1}
              />
            </Grid>
            <Grid xs={2}>
              <TextField
                variant="outlined"
                label="2nd"
                InputLabelProps={{
                  shrink: true,
                }}
                value={value2}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTimeInput(e, setValue2)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
                inputRef={input2}
              />
            </Grid>
            <Grid xs={2}>
              <TextField
                variant="outlined"
                label="3rd"
                InputLabelProps={{
                  shrink: true,
                }}
                value={value3}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTimeInput(e, setValue3)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
                inputRef={input3}
              />
            </Grid>
            <Grid xs={2}>
              <TextField
                variant="outlined"
                label="4th"
                InputLabelProps={{
                  shrink: true,
                }}
                value={value4}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTimeInput(e, setValue4)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
                inputRef={input4}
              />
            </Grid>
            <Grid xs={2}>
              <TextField
                variant="outlined"
                label="5th"
                InputLabelProps={{
                  shrink: true,
                }}
                value={value5}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTimeInput(e, setValue5)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
                inputRef={input5}
              />
            </Grid>
            <Grid xs={1}>
              <Button
                variant="contained"
                sx={{ width: "100%", height: "100%" }}
                onClick={() => registerRecord()}
                onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => handleKeyDown(e)}
                ref={buttonRef}
              >
                登録
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Modal open={copyModalOpened} onClose={handleCloseCopyModal}>
        <Paper sx={style}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            必要情報を入力してください
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={2}>
              <TextField
                label="大会ID"
                variant="outlined"
                sx={{ mb: 1 }}
                value={inputCompId}
                onChange={setInputCompId}
              />
            </Grid>
            <Grid xs={5}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel id="select-label">イベント</InputLabel>
                <Select
                  labelId="select-label"
                  value={selectEvent}
                  label="イベント"
                  onChange={(event) => setSelectEvent(event)}
                >
                  <MenuItem value={1} key={1}>
                    3×3×3
                  </MenuItem>
                  <MenuItem value={2} key={2}>
                    2×2×2
                  </MenuItem>
                  <MenuItem value={3} key={3}>
                    4×4×4
                  </MenuItem>
                  <MenuItem value={4} key={4}>
                    5×5×5
                  </MenuItem>
                  <MenuItem value={5} key={5}>
                    6×6×6
                  </MenuItem>
                  <MenuItem value={6} key={6}>
                    7×7×7
                  </MenuItem>
                  <MenuItem value={7} key={7}>
                    3BLD
                  </MenuItem>
                  <MenuItem value={8} key={8}>
                    FMC
                  </MenuItem>
                  <MenuItem value={9} key={9}>
                    3OH
                  </MenuItem>
                  <MenuItem value={10} key={10}>
                    クロック
                  </MenuItem>
                  <MenuItem value={11} key={11}>
                    メガミンクス
                  </MenuItem>
                  <MenuItem value={12} key={12}>
                    ピラミンクス
                  </MenuItem>
                  <MenuItem value={13} key={13}>
                    スキューブ
                  </MenuItem>
                  <MenuItem value={14} key={14}>
                    スクエア1
                  </MenuItem>
                  <MenuItem value={15} key={15}>
                    4BLD
                  </MenuItem>
                  <MenuItem value={16} key={16}>
                    5BLD
                  </MenuItem>
                  <MenuItem value={17} key={17}>
                    MBLD
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={5}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel id="select-label">ラウンド</InputLabel>
                <Select
                  labelId="select-label"
                  value={selectRound}
                  label="ラウンド"
                  onChange={(event) => setSelectRound(event)}
                >
                  <MenuItem value={1} key={1}>
                    一回戦
                  </MenuItem>
                  <MenuItem value={2} key={2}>
                    二回戦
                  </MenuItem>
                  <MenuItem value={3} key={3}>
                    準決勝
                  </MenuItem>
                  <MenuItem value={4} key={4}>
                    決勝
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCloseCopyModal}>
              キャンセル
            </Button>
            <Button variant="contained" sx={{ ml: 2 }} onClick={copy}>
              コピーする
            </Button>
          </Grid>
        </Paper>
      </Modal>
      <Dialog open={allDeleteDialogOpened} onClose={handleCloseAllDeleteDialog}>
        <DialogContent>
          <DialogContentText>入力した内容がすべて削除されます。元に戻せません。</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAllDeleteDialog} variant="outlined">
            キャンセル
          </Button>
          <Button onClick={allDelete} variant="contained">
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Input;
