import { useParams } from "react-router-dom";
import { Chords } from "../../components/Chords/Chords";
import Lyrics from "../../components/Lyrics/Lyrics";
import { TransposeProvider, useTransposeContext } from "../../context/TransposeContext";
import { TransposeControl } from "../../components/TranponseControl/TransposeControl";
import "./style.scss";
import { useEffect, useState } from "react";
import { SongItem, SongList } from "../../constans/songList";
import { useIndexedDbContext } from "../../context/IndexedDbContext";
import { useIndexedDB } from "react-indexed-db-hook";

export const SongPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState<SongItem>();
  const [songArr, setSongArr] = useState<string[] | undefined>([]);
  const [title, setTitle] = useState<string | undefined>('');
  const { update, getByID } = useIndexedDB('songs');
  const { semitones, setValue } = useTransposeContext();

  useEffect(() => {
    const findedSong = SongList.find(song => song.id.toString() === id);
    if(findedSong){
      getByID(findedSong?.id).then((fromDb) => {
        setSong(fromDb);
        if(fromDb){
          setValue(+fromDb?.semitones);
        }else {
          setValue(0);
        }
      });
    } 
    const pre = findedSong?.text;
    setTitle(findedSong?.title);
  
    let arr: string[] | undefined = pre?.split("\n");
    setSongArr(arr);
  }, [id])

  const updateSongList = (ev: number) => {
    if (song) {
      update({ ...song, semitones: `${ev}` });
    }
  };

  return (
      <div className="song">
      <div className="song__title">
      {songArr && <TransposeControl semitones={semitones} onSemitonesChange={updateSongList}></TransposeControl>}
        <p>{title}</p>
        </div>
      <div className="song__items">
   
        {songArr && songArr.map((songEl, index) => (
          <div key={songEl + index}>
           {index % 2 === 0 && <Chords>{songEl}</Chords> }
           {index % 2 !== 0 &&  <Lyrics>{songEl}</Lyrics> }
          </div>
        ))}
      </div>
      </div>
  );
};

export default SongPage;
