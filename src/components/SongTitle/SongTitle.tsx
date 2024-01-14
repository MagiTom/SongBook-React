import AddIcon from '@mui/icons-material/Add';
import IconButton from "@mui/material/IconButton";
import React from "react";
import "./style.scss";
import { SongListLeft } from '../../models/SongListLeft.model';

export interface SongItemProp {
song: SongListLeft;
addSongToList: (songItem: SongListLeft) => void;
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
</IconButton><p>{props.song.title}</p><span> #{props.song.category}</span></div>);
};

export default SongTitle;