import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import "./style.scss";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../../context/ErrorContext";
import { useSongsDbContext } from "../../context/firebaseContext";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";

export const LoginPage = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { addError } = useErrorContext();
  const { createUserDocument } = useSongsDbContext();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onLogin = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          handleClose();
          createUserDocument(user);
          setOpen(true);
          setTimeout(() => {
            navigate("/");
          }, 500);
        })
        .catch((error: any) => {
          addError(error?.message);
        });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        // An error happened.
      });
  };
  function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    if (key === "Enter") {
      onLogin(event);
    }
  }

  return (
    <div className="login">
      <div className="login__row">
        <div className="login__col">
          <Typography className="login__info" variant="h5">
            Śpiewnik gitarowy
          </Typography>
        </div>
        <div className={`login__col ${open ? "fade-in-image" : ""}`}>
          <Typography className="login__title" variant="h4">
            Logowanie
          </Typography>
          <Box className="login__box">
            <TextField
              color="success"
              autoFocus
              margin="dense"
              id="name"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              color="success"
              onKeyPress={(e) => handleKeyPress(e)}
              autoFocus
              margin="dense"
              id="password"
              label="Hasło"
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              disabled={!email || !password}
              sx={{ mt: "2em", width: "100%" }}
              color="success"
              variant="contained"
              size="large"
              onClick={(event) => onLogin(event)}
            >
              zaloguj się
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
