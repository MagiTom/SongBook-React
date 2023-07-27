import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useTransposeContext } from "../../context/TransposeContext";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./styles.scss";
import { useIndexedDbContext } from "../../context/IndexedDbContext";
import { SongItem } from "../../constans/songList";

export const TransposeControl: React.FC<any> = (song: SongItem | any) => {
  const { semitones, reset, decrement, increment } = useTransposeContext();
  const {
    songList,
    handleInitDB,
    addSong,
    deleteSong,
    updateSong,
    getSongList,
  } = useIndexedDbContext();
  const isUnison = semitones === 0;
  const updateSongList = () => {
    const findedSong = songList?.find((song) => song.id.toString() === song.id);
    if (findedSong) {
      updateSong(song.id, { ...song, semitones });
    }
  };
  const reseting = () => {
    reset();
    updateSongList();
  };
  const decrementing = () => {
    decrement();
    updateSongList();
  };
  const incrementing = () => {
    increment();
    updateSongList();
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
      <IconButton onClick={incrementing}>
        <AddCircleOutlineIcon />
      </IconButton>
    </div>
  );
};
