import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../components/Button/Button";

const Top = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid display="flex" justifyContent="center" xs={6}>
          <StyledButton color="success" variant="outlined" onClick={() => navigate("input")}>
            <Typography variant="h5">記録入力</Typography>
          </StyledButton>
        </Grid>
        <Grid display="flex" justifyContent="center" xs={6}>
          <StyledButton color="success" variant="outlined" onClick={() => navigate("check")}>
            <Typography variant="h5">入力確認</Typography>
          </StyledButton>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Top;
