import {
  alpha,
  Button,
  Grid2,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useDispatch, useSelector } from "react-redux";
import { set } from "../redux/slices/informationsSlice";
import { roomControl } from "../helper/valueControls";

const RoomPaper = ({ swipePage }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.informations);
  const theme = useTheme().palette;
  return (
    <Paper
      sx={{
        bgcolor: alpha(theme.background.card, 0.5),
        p: 4,
        minHeight: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid2 container sx={{ width: "100%" }}>
        <Grid2
          item
          container
          justifyContent="center"
          alignItems="center"
          size={2}
        >
          <IconButton
            sx={{ width: "50%", aspectRatio: "1/1" }}
            onClick={() => swipePage(0)}
            color="primary"
          >
            <ArrowBackIosOutlinedIcon />
          </IconButton>
        </Grid2>
        <Grid2 item size={8}>
          <RoomLinkBar state={state} dispatch={dispatch} />
        </Grid2>
        <Grid2
          item
          container
          justifyContent="center"
          alignItems="center"
          size={2}
        >
          <IconButton
            sx={{ width: "50%", aspectRatio: "1/1" }}
            disabled={!roomControl(state.room)}
            onClick={() => swipePage(2)}
            color="primary"
          >
            <ArrowForwardIosOutlinedIcon sx={{ width: "100%" }} />
          </IconButton>
        </Grid2>
      </Grid2>
    </Paper>
  );
};

const RoomLinkBar = ({ state, dispatch }) => {
  return (
    <>
      <Grid2 container flexDirection="column" spacing={4}>
        <Grid2 textAlign="center" width="100%" item>
          <Typography component="h4" variant="h4">
            Oda
          </Typography>
        </Grid2>
        <Grid2 item container flexDirection="row" spacing={2}>
          <TextField
            // helperText={
            //   state.wrongInputs.indexOf("username") !== -1
            //     ? "Username has to contain at least 6 character."
            //     : false
            // }
            // error={state.wrongInputs.indexOf("username") !== -1}
            // margin="normal"
            value={state.room}
            onChange={(e) =>
              dispatch(set({ name: "room", value: e.target.value }))
            }
            required
            fullWidth
            id="username"
            name="username"
            label="Oda Link"
          />
          <Button variant="contained" color="primary" fullWidth>
            Oda Kur
          </Button>
        </Grid2>
      </Grid2>
    </>
  );
};

export default RoomPaper;
