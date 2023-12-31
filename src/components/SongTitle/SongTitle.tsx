import AddIcon from '@mui/icons-material/Add';
import IconButton from "@mui/material/IconButton";
import React from "react";
import { SongItem } from "../../constans/songList";
import "./style.scss";

export interface SongItemProp {
song: SongItem;
addSongToList: (songItem: SongItem) => void;
goToPage: () => void;
}

const SongTitle: React.FC<SongItemProp> = (props) => {
  const goPage = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    props.goToPage();
  };
  const addToList = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    props.addSongToList(props.song)
  };


  return (<div onClick={goPage} className="songTitle"><IconButton sx={{padding: 0.5}} className={props.song.added ? 'hidden' : ''} onClick={addToList} color="secondary" aria-label="add an alarm">
  <AddIcon />
</IconButton><p>{props.song.title}</p></div>);
};

export default SongTitle;