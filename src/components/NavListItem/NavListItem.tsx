import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export const NavListItem: React.FC<any> = ({ text, goToPage }) => {
  return (
    <>
      <ListItem disablePadding onClick={() => goToPage()}>
        <ListItemButton>
          <ListItemIcon>{<MusicNoteIcon></MusicNoteIcon>}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    </>
  );
};
