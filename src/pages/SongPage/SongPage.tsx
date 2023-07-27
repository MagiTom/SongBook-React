import { useParams } from "react-router-dom";
import { Chords } from "../../components/Chords/Chords";
import Lyrics from "../../components/Lyrics/Lyrics";
import { TransposeProvider } from "../../context/TransposeContext";
import { TransposeControl } from "../../components/TranponseControl/TransposeControl";
import "./style.scss";
import { useEffect, useState } from "react";
import { SongItem, SongList } from "../../constans/songList";
import { useIndexedDbContext } from "../../context/IndexedDbContext";

export const SongPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState<SongItem>();
  const [songArr, setSongArr] = useState<string[] | undefined>([]);
  const [title, setTitle] = useState<string | undefined>('');

  useEffect(() => {
    const findedSong = SongList.find(song => song.id.toString() === id);
    setSong(findedSong);
    const pre = findedSong?.text;
    setTitle(findedSong?.title);
  
    let arr: string[] | undefined = pre?.split("\n");
    setSongArr(arr);
  }, [id])

  return (
      <div className="song">
      <div className="song__title">
      <TransposeControl song={song}></TransposeControl>
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
