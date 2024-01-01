import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../../context/ErrorContext";
import { auth } from "../../firebase-config";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";

const LoginDialog: React.FC<{ isLogin: boolean }> = (props) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { addError } = useErrorContext();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        handleClose();
        console.log(user);
      })
      .catch((error: any) => {
        addError(error?.message);
      });
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

  return (
    <React.Fragment>
      {!props.isLogin && (
        <Button variant="outlined" onClick={handleClickOpen}>
          Admin
        </Button>
      )}
      {props.isLogin && (
        <Button variant="outlined" onClick={handleLogOut}>
          wyloguj
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>LOGOWANIE</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Zaloguj się jako administrator, aby móc dodawać lub edytować teksty.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Hasło"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="standard"
            InputProps={{
              endAdornment:
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
              
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>anuluj</Button>
          <Button onClick={(event) => onLogin(event)}>zaloguj się</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default LoginDialog;
