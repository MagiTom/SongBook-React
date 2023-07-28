import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useTransposeContext } from "../../context/TransposeContext";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./styles.scss";
import { useIndexedDbContext } from "../../context/IndexedDbContext";
import { SongItem } from "../../constans/songList";
import { useIndexedDB } from "react-indexed-db-hook";
import { useEffect, useState } from "react";

export const TransposeControl: React.FC<any> = (song: SongItem | any) => {
  const { semitones, reset, decrement, increment, setValue } = useTransposeContext();
  const { update, getByIndex, getAll } = useIndexedDB('songs');
  const isUnison = semitones === 0;
  const [currentSong, setCurrentSong] = useState<SongItem>();

  useEffect(() => {
    console.log(song)
    if(song.song){
      getAll().then((items) => {
        const songItem: SongItem = items.find(item => item.id == song.song.id);
        if(songItem.semitones){
          setCurrentSong(songItem);
          setValue(+songItem.semitones);
        }
      });
    }
  }, [song])

  useEffect(()=>{
    updateSongList();
  }, [semitones])

  const updateSongList = () => {
    if (currentSong) {
    
      update({ ...currentSong, semitones: `${semitones}` });
    }
  };
  const reseting = () => {
    reset();
  };
  const decrementing = () => {
    decrement();
  };
  const incrementing = () => {
    increment();
  };
  return (
    <div className="trans">
      <span className="trans__title">Transpose</span>

      <IconButton onClick={reseting} disabled={isUnison}>
        <RestartAltIcon />
      </IconButton>
      <IconButton onClick={decrementing}>
        <RemoveCircleOutlineIcon />
      </IconButton>
      <div>{semitones}</div>
      <IconButton onClick={() => incrementing()}>
        <AddCircleOutlineIcon />
      </IconButton>
    </div>
  );
};
