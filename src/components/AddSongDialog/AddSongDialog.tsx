import React from "react";
import Button from "@mui/material/Button";
import { Category } from "../../constans/categories";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import { useSongsDbContext } from "../../context/firebaseContext";
import { SongToAdd } from "../../constans/songList";

const AddSongDialog = () => {
    const { addSongDb } = useSongsDbContext();
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState<string>('');
    const [text, setText] = React.useState<string>('');
    const [category, setCategory] = React.useState<string>('');

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

   const handleAddSong = async () => {
    const songToAdd: SongToAdd = {
        title,
        category,
        text,
    }
      await addSongDb(songToAdd);
        handleClose()    
    }
  
    return (
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open form dialog
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We
              will send updates occasionally.
            </DialogContentText>
            <TextField
          fullWidth
          variant="standard"
          label="category"
          margin="dense"
          id="category"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCategory(event.target.value);
          }}
        />
            <TextField
          fullWidth
          variant="standard"
          label="title"
          margin="dense"
          id="title"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(event.target.value);
          }}
        />
            <TextField
              margin="dense"
              id="text"
              label="text"
              multiline
              fullWidth
              variant="standard"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setText(event.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddSong}>Subscribe</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
};

export default AddSongDialog;
