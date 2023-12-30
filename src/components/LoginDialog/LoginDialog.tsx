import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../firebase-config";
import ErrorModal from "../ErrorModal/ErrorModal";
import { useErrorContext } from "../../context/ErrorContext";

const LoginDialog: React.FC<{isLogin: boolean}> = (props) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  // const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const { error, addError } = useErrorContext();


  const onLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // setErrorMessage('');
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        handleClose();
        console.log(user);
      })
      .catch((error: any) => {
        const errorCode = 'Błąd';
        // setErrorMessage(error.message);
        console.log('errorCode', error?.message);
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
    signOut(auth).then(() => {
      // Sign-out successful.
          navigate("/");
          console.log("Signed out successfully")
      }).catch((error) => {
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
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
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
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={(event) => onLogin(event)}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default LoginDialog;
