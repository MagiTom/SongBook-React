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

export const SongPage = () => {
  const { id } = useParams();
  const { songListDb, getSongDb, deleteSongDb } = useSongsDbContext();
  const [songDB, setSongDB] = useState<SongItem>();
  const [song, setSong] = useState<SongPageItem>();
  const { update, getByID } = useIndexedDB('songs');
  const { removeSong } = useSongListContext();
  const { semitones, setValue } = useTransposeContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(songListDb){
      const findedSong = songListDb?.find(song => song.id.toString() === id);
      if(findedSong){
        getSongDb(findedSong.id, findedSong.title).then(song =>{
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
      await deleteSongDb(id, song?.id, song?.title);
      //usunac tez z indexed db
      removeSong({...song, id})
      navigate('/');
  }

  return (
      <div className="song">
      <div className="song__title">
      {/* {song && <TransposeControl semitones={semitones} onSemitonesChange={updateSongList}></TransposeControl>} */}
        </div>
      {song && <SongView song={song}></SongView>}

      <Button onClick={handleRemove} variant="contained" color="error">
  Delete
</Button>
      </div>
  );
};

export default SongPage;
