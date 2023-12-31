import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../../constans/categories";
import { SongPageItem, SongToAdd } from "../../constans/songList";
import { useSongListContext } from "../../context/SongListContext";
import { useSongsDbContext } from "../../context/firebaseContext";
import AlertDialog from "../AlertDialog/AlertDialog";
import "./style.scss";

export type SongProps = {
  song?: SongPageItem;
  id?: string;
};

const AddSongDialog: React.FC<SongProps> = (prop) => {
  const { addSongDb, updateSongDb } = useSongsDbContext();
  const [open, setOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [title, setTitle] = React.useState<string>("");
  const [text, setText] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [newCategory, setNewCategory] = React.useState<string>("");
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const { updateSongList, editSongList } = useSongListContext();
  const { categoriesDb, deleteCategoryDb, addCategoryDb } = useSongsDbContext();
  const navigate = useNavigate();

  useEffect(() => {
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
    setSubmitted(true);
    if (title && category && text) {
      const songToAdd: SongToAdd = {
        title,
        category,
        text,
      };
      const id = await addSongDb(songToAdd);
      updateSongList({ ...songToAdd, id: id });
      clearData();
      handleClose();
    }
  };

  const handleEditSong = async () => {
    const songToAdd: SongPageItem = {
      title,
      category,
      text,
      id: prop.song?.id || "",
    };
    await updateSongDb(prop?.id || "", songToAdd);
    editSongList(songToAdd, prop.id);
    clearData();
    handleClose();
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setCategory(event.target.value);
  };
  const addCategory = async () => {
    const categororyItem: Category = {
      name: newCategory,
    };
    await addCategoryDb(categororyItem);
    setCategory(categororyItem.name);
    setNewCategory("");
  };
  const deleteCategory = async (categoryItem: Category) => {
    await deleteCategoryDb(categoryItem?.id || "");
    console.log(category);
    if (categoryItem.name === category) {
      setCategory("");
    } else {
      setCategory(category);
    }
  };
  const clearData = () => {
    setTitle("");
    setText("");
    setCategory("");
    setSubmitted(false);
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
        <DialogTitle>DODAJ UTWÓR</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p className="example">
              <span>Przykład:</span> <br />
              G C Em D <br />
              Mabuhay kayong mga di pangkaraniwan <br />
            </p>
          </DialogContentText>

          <div className="category">
            <FormControl fullWidth error={submitted && !category}>
              <InputLabel id="demo-simple-select-label">kategoria</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="kategoria"
                onChange={(event) => handleChangeCategory(event)}
              >
                {categoriesDb.map((category) => (
                  <MenuItem value={category.name} key={category.id}>
                    <div className="category__item">
                      <p>{category.name}</p>

                      <AlertDialog
                        confirmAction={() => deleteCategory(category)}
                        button={
                          <IconButton aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        }
                      ></AlertDialog>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="category__add">
              <TextField
                fullWidth
                variant="filled"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewCategory(event.target.value);
                }}
                value={newCategory}
                label="nowa kategoria"
                margin="dense"
                id="category"
              />
              <Button variant="contained" color="success" onClick={addCategory}>
                Dodaj Kategorię
              </Button>
            </div>
          </div>
          <TextField
            fullWidth
            variant="standard"
            label="tytuł"
            margin="dense"
            id="title"
            value={title}
            error={submitted && !title}
            helperText={submitted && !title ? "Podaj Tytuł!" : ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="text"
            label="tekst"
            error={submitted && !text}
            helperText={submitted && !text ? "Podaj tekst!" : ''}
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
          <Button onClick={handleClose}>Anuluj</Button>
          {!editMode && <Button onClick={handleAddSong}>Dodaj</Button>}
          {editMode && <Button onClick={handleEditSong}>Edytuj</Button>}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddSongDialog;
