import { useParams } from "react-router-dom";
import { TransposeProvider, useTransposeContext } from "../../context/TransposeContext";
import { TransposeControl } from "../../components/TranponseControl/TransposeControl";
import "./style.scss";
import { useEffect, useState } from "react";
import { SongItem, SongList } from "../../constans/songList";
import { useIndexedDB } from "react-indexed-db-hook";
import {SongView} from  "../../components/SongView/SongView"

export const SongPage = () => {
  const { id } = useParams();
  const [songDB, setSongDB] = useState<SongItem>();
  const [song, setSong] = useState<SongItem>();
  const { update, getByID } = useIndexedDB('songs');
  const { semitones, setValue } = useTransposeContext();

  useEffect(() => {
    const findedSong = SongList.find(song => song.id.toString() === id);
    setSong(findedSong);
    if(findedSong){
      getByID(findedSong?.id).then((fromDb) => {
        setSongDB(fromDb);
        if(fromDb){
          setValue(+fromDb?.semitones);
        }else {
          setValue(0);
        }
      });
    } 
  }, [id])

  const updateSongList = (ev: number) => {
    if (songDB) {
      update({ ...songDB, semitones: `${ev}` });
    }
  };

  return (
      <div className="song">
      <div className="song__title">
      {/* {song && <TransposeControl semitones={semitones} onSemitonesChange={updateSongList}></TransposeControl>} */}
        </div>
      {song && <SongView song={song}></SongView>}
      </div>
  );
};

export default SongPage;
