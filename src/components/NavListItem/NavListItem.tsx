import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export const NavListItem: React.FC<any> = ({ text, goToPage, addToList, removeSong }) => {
  return (
    <>
      <ListItem disablePadding onClick={() => goToPage()}>
    {addToList && <ListItemIcon onClick={addToList}>{<MusicNoteIcon></MusicNoteIcon>}</ListItemIcon>}
    {removeSong && <ListItemIcon onClick={removeSong}>--</ListItemIcon>}
        <ListItemButton>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    </>
  );
};
