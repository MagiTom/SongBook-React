import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Tooltip } from "@mui/material";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { SongItem } from "../../constans/songList";
import "./style.scss";

interface NavListItemProps{
  song: SongItem,
  selected: boolean,
  goToPage: () => void, 
  addToList?: () => void,  
  removeSong?: () => void, 
}

export const NavListItem: React.FC<NavListItemProps> = ({ song, goToPage, addToList, removeSong, selected }) => {

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
      <ListItem sx={{pt: 0, pb: 0, pr: 0, pl: 0.5}} onClick={() => goToPage()}>
    {addToList && <Tooltip title="Dodaj" arrow><ListItemIcon className={song?.added ? 'hidden' : ''} onClick={handleAddToList}>{<AddCircleIcon />}</ListItemIcon></Tooltip>}
    {removeSong && <Tooltip title="Usuń" arrow><ListItemIcon onClick={handleRemoveSong}>{<RemoveCircleIcon />}</ListItemIcon></Tooltip>}
        <ListItemButton selected={selected} sx={{padding: 0.5}}>
          <ListItemText      primaryTypographyProps={{
                  fontSize: 12,
                  fontWeight: 'bolder',
                }} className="text" primary={song.title} />
        </ListItemButton>
      </ListItem>
    </>
  );
};
