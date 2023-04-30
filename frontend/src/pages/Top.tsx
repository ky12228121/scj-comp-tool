import { Container, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { WideButton } from "../components/WideButton";

const Top = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid display="flex" justifyContent="center" xs={6}>
          <WideButton color="success" variant="outlined" onClick={() => navigate("input")}>
            <Typography variant="h5">記録入力</Typography>
          </WideButton>
        </Grid>
        <Grid display="flex" justifyContent="center" xs={6}>
          <WideButton color="success" variant="outlined" onClick={() => navigate("check")}>
            <Typography variant="h5">入力確認</Typography>
          </WideButton>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Top;
