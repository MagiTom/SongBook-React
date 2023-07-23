import { useParams } from "react-router-dom";
import { Chords } from "../../components/Chords/Chords";
import Lyrics from "../../components/Lyrics/Lyrics";
import { TransposeProvider } from "../../context/TransposeContext";
import { TransposeControl } from "../../components/TranponseControl/TransposeControl";
import "./style.scss";
import { useEffect, useState } from "react";
import { SongList } from "../../constans/songList";

export const SongPage = () => {
  const { id } = useParams();
  const [songArr, setSongArr] = useState<string[] | undefined>([]);
  const [title, setTitle] = useState<string | undefined>('');

  useEffect(() => {
    const findedSong = SongList.find(song => song.id.toString() === id);
    const pre = findedSong?.text;
    setTitle(findedSong?.title);
  
    let arr = pre?.split("\n");
    setSongArr(arr);
    console.log(arr)
  }, [id])

  return (
    <TransposeProvider>
      <div className="song">
      <div className="song__title">
      <TransposeControl></TransposeControl>
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

   
    </TransposeProvider>
  );
};

export default SongPage;
