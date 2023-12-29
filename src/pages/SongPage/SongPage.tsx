import { useNavigate, useParams } from "react-router-dom";
import { TransposeProvider, useTransposeContext } from "../../context/TransposeContext";
import { TransposeControl } from "../../components/TranponseControl/TransposeControl";
import "./style.scss";
import { useEffect, useState } from "react";
import { SongItem, SongList, SongPageItem } from "../../constans/songList";
import { useIndexedDB } from "react-indexed-db-hook";
import {SongView} from  "../../components/SongView/SongView"
import { useSongsDbContext } from "../../context/firebaseContext";
import { Button } from "@mui/material";
import { useSongListContext } from "../../context/SongListContext";
import AddSongDialog from "../../components/AddSongDialog/AddSongDialog";

export const SongPage = () => {
  const { id } = useParams();
  const { songListDb, getSongDb, deleteSongDb } = useSongsDbContext();
  const [songDB, setSongDB] = useState<SongItem>();
  const [song, setSong] = useState<SongPageItem>();
  const { update, getByID } = useIndexedDB('songs');
  const { deleteSongFromList, songItemList, removeSong } = useSongListContext();
  const { semitones, setValue } = useTransposeContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(songListDb){
      const findedSong = songListDb?.find(song => song.id.toString() === id);
      console.log('idd', id)
      console.log('findedSong', findedSong)
      if(findedSong){
        getSongDb(findedSong.id).then(song =>{
          setSong(song);
          getByID(findedSong?.id).then((fromDb) => {
            setSongDB(fromDb);
            if(fromDb){
              setValue(+fromDb?.semitones);
            }else {
              setValue(0);
            }
          });
        })

      } 
    }


  }, [id, songListDb])

  const updateSongList = (ev: number) => {
    if (songDB) {
      update({ ...songDB, semitones: `${ev}` });
    }
  };

  const handleRemove = async () => {
    console.log('idd', id)
    console.log('song', song)
    if(id && song)
      await deleteSongDb(id, song?.id);
      //usunac tez z indexed db
      const checkIfInIndexesDb = songItemList.find((item: SongItem) => item.id === id);
      console.log('checkIfInIndexesDb', checkIfInIndexesDb)
      if(checkIfInIndexesDb){
        removeSong(checkIfInIndexesDb);
      }else {
        deleteSongFromList(id);
      }
  
      navigate('/');
  }

  return (
      <div className="song">
      <div className="song__title">
      {/* {song && <TransposeControl semitones={semitones} onSemitonesChange={updateSongList}></TransposeControl>} */}
        </div>
      {song && <SongView song={song}></SongView>}
<div className="song__actions">
<Button onClick={handleRemove} variant="contained" color="error">
  Delete
</Button>
<AddSongDialog song={song} id={id}></AddSongDialog>
</div>
      </div>
  );
};

export default SongPage;
