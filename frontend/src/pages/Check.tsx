import {
  Container,
  Unstable_Grid2 as Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { contexts } from "../providers";
import { InputTable, RecordType } from "../types";
import { convertTimeIntToTimeString } from "../utils/convert";

const Check = () => {
  const message = useContext(contexts.WebSocketMessageContext);
  const [record, setRecord] = useState<RecordType[]>([]);
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
  useEffect(() => {
    if (message?.action === "input") {
      const newRecord: RecordType = {
        ...message,
        id: String(message.scj_id),
      };
      delete newRecord.room_id;
      setRecord((prev) => [...prev, newRecord]);
    } else if (message?.action === "delete") {
      const newRecord = record.filter((record) => record.id !== String(message.scj_id));
      setRecord(newRecord);
    } else if (message?.action === "all_delete") {
      setRecord([]);
    }
  }, [message]);
  return (
    <Container>
      <Grid container sx={{ mb: 5, mt: 5 }}>
        <Grid xs={12}>
          <TableContainer
            component={Paper}
            sx={{ maxWidth: "100%", height: "80vh", bg: "#e5e5e5" }}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Check;
