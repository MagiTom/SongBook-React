import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertDialogProps {
    // isOpen: boolean;
    confirmAction: () => void;
    button: string | any
  }
 const AlertDialog: React.FC<AlertDialogProps> = (props) =>{
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (event:  React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    props.confirmAction();
    setOpen(false);
  };
  

  return (
    <React.Fragment>
      <div onClick={(event)=>handleClickOpen(event)}>
        {props.button}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Czy na pewno chcesz usunąć element?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>nie</Button>
          <Button onClick={handleConfirm} autoFocus>
            tak
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AlertDialog;