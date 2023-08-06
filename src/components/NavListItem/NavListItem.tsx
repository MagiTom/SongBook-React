import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import "./style.scss";

export const NavListItem: React.FC<any> = ({ text, goToPage, addToList, removeSong }) => {
  return (
    <>
      <ListItem onClick={() => goToPage()}>
    {addToList && <ListItemIcon onClick={addToList}>{<AddCircleIcon />}</ListItemIcon>}
    {removeSong && <ListItemIcon onClick={removeSong}>{<RemoveCircleIcon />}</ListItemIcon>}
        <ListItemButton>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    </>
  );
};
