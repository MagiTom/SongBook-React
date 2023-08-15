import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import "./style.scss";
import { Tooltip } from "@mui/material";
import { SongItem } from "../../constans/songList";

interface NavListItemProps{
  song: SongItem,
  goToPage: () => void, 
  addToList?: () => void,  
  removeSong?: () => void, 
}

export const NavListItem: React.FC<NavListItemProps> = ({ song, goToPage, addToList, removeSong }) => {

  const handleAddToList = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (addToList) {
      addToList();
    }
  };

  const handleRemoveSong = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (removeSong) {
      removeSong();
    }
  };

  return (
    <>
      <ListItem onClick={() => goToPage()}>
    {addToList && <Tooltip title="Dodaj" arrow><ListItemIcon className={song?.added ? 'hidden' : ''} onClick={handleAddToList}>{<AddCircleIcon />}</ListItemIcon></Tooltip>}
    {removeSong && <Tooltip title="Usuń" arrow><ListItemIcon onClick={handleRemoveSong}>{<RemoveCircleIcon />}</ListItemIcon></Tooltip>}
        <ListItemButton>
          <ListItemText primary={song.title} />
        </ListItemButton>
      </ListItem>
    </>
  );
};
