import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import "../App.css";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            color: (theme) => theme.palette.grey[500],
          }}
        ></IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const UserProfile = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //initiate states for user specific win rate & most used pokemon.
  const [winRate, setWinRate] = useState();
  const [mostUsedPokemonImage, setMostUsedPokemonImage] = useState("");

  // To only load user profile after all the components load, and after props.userData loads (i.e. userStats state in Mainpage.js)
  useEffect(() => {
    if (props.userData[0]) {
      const { gamesPlayed, gamesWon, mostUsed } = props.userData[0];
      setWinRate(((gamesWon / gamesPlayed) * 100).toFixed(2));

      if (mostUsed !== "") {
        axios
          .get(`https://pokeapi.co/api/v2/pokemon/${mostUsed}`)
          .then((result) => {
            const { sprites } = result.data;
            console.log(sprites);
            const pokemonImageFront = sprites.other.dream_world.front_default;
            return pokemonImageFront;
          })
          .then((data) => setMostUsedPokemonImage(data));
      }
    } else return;
  }, [props.userData[0]]);

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => {
          handleClickOpen();
        }}
      >
        UserStats
      </Button>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          color="primary"
        >
          <Typography variant="h4" color="primary" mt={4}>
            User Stats{" "}
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {/* {listItems} */}
          <Typography>
            {props.userData != null ? (
              <div>
                <p>Welcome back user {props.userData[0].username}!</p>
                <p>Games Played: {props.userData[0].gamesPlayed}</p>
                <p>Games Won: {props.userData[0].gamesWon}</p>
                {props.userData[0].gamesPlayed === 0 ? (
                  <p>Win Rate: NA </p>
                ) : (
                  <p>Win Rate: {winRate}%</p>
                )}
                {props.userData[0].mostUsed !== "" ? (
                  <div>
                    <p>Most used Pokemon: {props.userData[0].mostUsed} </p>
                    <img
                      style={{ height: "20vh" }}
                      src={mostUsedPokemonImage}
                      alt={mostUsedPokemonImage}
                    />
                  </div>
                ) : (
                  <p>Most used Pokemon: NA</p>
                )}
              </div>
            ) : (
              <p>Welcome back user!</p>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default UserProfile;
