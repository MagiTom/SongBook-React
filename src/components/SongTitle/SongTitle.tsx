import React from "react";
import Button from "@mui/material/Button";
import { Category } from "../../constans/categories";
import { SongItem } from "../../constans/songList";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import "./style.scss";

export interface SongItemProp {
song: SongItem;
added: boolean;
addSongToList: (songItem: SongItem) => void;
}

const SongTitle: React.FC<SongItemProp> = (props) => {
  return (<div className="songTitle">{!props.added && <IconButton onClick={() => props.addSongToList(props.song)} color="secondary" aria-label="add an alarm">
  <AddIcon />
</IconButton>}<p>{props.song.title}</p></div>);
};

export default SongTitle;