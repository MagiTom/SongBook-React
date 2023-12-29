import React, { RefObject, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { Category } from "../../constans/categories";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useSongsDbContext } from "../../context/firebaseContext";
import { SongPageItem, SongToAdd } from "../../constans/songList";
import { useSongListContext } from "../../context/SongListContext";

export type SongProps = {
  song?: SongPageItem;
  id?: string;
};

const AddSongDialog: React.FC<SongProps> = (prop) => {
  const { addSongDb, updateSongDb } = useSongsDbContext();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState<string>("");
  const [text, setText] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [newCategory, setNewCategory] = React.useState<string>("");
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const { updateSongList } = useSongListContext();
  const { categoriesDb, deleteCategoryDb, addCategoryDb } = useSongsDbContext();

  useEffect(() => {
    console.log("sssssss", prop.song?.id);
    if (prop.song?.id) {
      setEditMode(true);
      setTitle(prop.song?.title);
      setText(prop.song.text);
      setCategory(prop.song.category);
    }
  }, [prop.song?.id]);

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
    };
    const id = await addSongDb(songToAdd);
    console.log("idididididid", id);
    updateSongList({ ...songToAdd, id: id });
    handleClose();
  };

  const handleEditSong = async () => {
    const songToAdd: SongPageItem = {
      title,
      category,
      text,
      id: prop.song?.id || "",
    };
    await updateSongDb(prop?.id || "", prop.song?.title || "", songToAdd);
    handleClose();
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
      console.log('eeeeeeee', event)
      setCategory(event.target.value);
  };
  const addCategory = async () => {
    const categororyItem: Category = {
      name: newCategory
    }
    await addCategoryDb(categororyItem);
    setCategory(categororyItem.name);
  };
  const removeCategory = async (id: string) => {
    await removeCategory(id);
    setCategory('');
  };

  return (
    <React.Fragment>
      {!editMode && (
        <Button variant="outlined" onClick={handleClickOpen}>
          Dodaj utwór
        </Button>
      )}

      {editMode && (
        <Button variant="outlined" onClick={handleClickOpen}>
          Edytuj
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>

          <div className="category">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Category"
                onChange={handleChangeCategory}
              >
              {categoriesDb.map(category => <MenuItem value={category.name}>{category.name}</MenuItem>)}  
              </Select>
            </FormControl>
            <div className="category__add">
              <TextField
                fullWidth
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewCategory(event.target.value);
                }}
                variant="standard"
                label="category"
                margin="dense"
                id="category"
              />
              <Button onClick={addCategory}>Dodaj Kategorie</Button>
            </div>
          </div>
          <TextField
            fullWidth
            variant="standard"
            label="title"
            margin="dense"
            id="title"
            value={title}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="text"
            label="text"
            value={text}
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
          {!editMode && <Button onClick={handleAddSong}>Dodaj</Button>}
          {editMode && <Button onClick={handleEditSong}>Edytuj</Button>}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddSongDialog;
