import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Tooltip } from "@mui/material";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { SongListLeft } from "../../models/SongListLeft.model";
import { SongListRight } from "../../models/SongListRight.model";
import "./style.scss";

interface NavListItemProps {
  song: SongListLeft | SongListRight;
  selected: boolean;
  goToPage: () => void;
  addToList?: () => void;
}

export const NavListItem: React.FC<NavListItemProps> = ({
  song,
  goToPage,
  addToList,
  selected,
}) => {
  const handleAddToList = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (addToList) {
      addToList();
    }
  };

  const isSongListLeft = (song: any): song is SongListLeft => {
    return "added" in song;
  };

  return (
    <>
      <ListItem
        sx={{ pt: 0, pb: 0, pr: 0, pl: 0.5 }}
        onClick={() => goToPage()}
      >
        <Tooltip title="Dodaj" arrow>
          <ListItemIcon
            className={isSongListLeft(song) && song.added ? "hidden" : ""}
            onClick={handleAddToList}
          >
            {<AddCircleIcon />}
          </ListItemIcon>
        </Tooltip>
        <ListItemButton selected={selected} sx={{ padding: 0.5 }}>
          <ListItemText
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: "bolder",
            }}
            className="text"
            primary={song.title}
          />
        </ListItemButton>
      </ListItem>
    </>
  );
};
