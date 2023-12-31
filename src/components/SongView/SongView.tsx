import { useEffect, useRef, useState } from "react";
import { SongItem, SongPageItem } from "../../constans/songList";
import { Chords } from "../Chords/Chords";
import Lyrics from "../Lyrics/Lyrics";
import { useTransposeContext } from "../../context/TransposeContext";
import { TransposeControl } from "../TranponseControl/TransposeControl";
import SongTitle from "../SongTitle/SongTitle";
import "./style.scss";
import { useIndexedDB } from "react-indexed-db-hook";
import { useSongsDbContext } from "../../context/firebaseContext";

export const SongView: React.FC<{
  song: SongPageItem;
  inDb: boolean;
  id: string;
  isPrintMode?: boolean;
}> = (props, inDb = false, isPrintMode = false) => {
  const [songArr, setSongArr] = useState<string[] | undefined>([]);
  const [songItem, setSongItem] = useState<SongPageItem>();
  const { update, getByID } = useIndexedDB("songs");
  const { semitones, setValue } = useTransposeContext();
  const { songListDb, getSongDb, deleteSongDb } = useSongsDbContext();

  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<any>(null);
  useEffect(() => {
    const element = textRef.current;
    if (element.offsetHeight > window.innerHeight) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [songArr]);

  // useEffect(() => {
  //   function checkTextOverflow() {
  //     const element = textRef.current;
  //     if (element && element.offsetHeight > window.innerHeight) {
  //       setIsOverflowing(true);
  //     } else {
  //       setIsOverflowing(false);
  //     }
  //     console.log('element', element)
  //     console.log('element', element.getBoundingClientRect())
  //     console.log('window.innerHeigh', window.innerHeight)
  //   }

  //   window.addEventListener('resize', checkTextOverflow);
  //   return () => {
  //     window.removeEventListener('resize', checkTextOverflow);
  //   };
  // }, []);

  const columnCountStyle = isOverflowing ? { columnCount: 2 } : { columnCount: 1 };

  useEffect(() => {
    const songItemEl = props.song;
    setSongItem(songItemEl);
    const pre = songItemEl?.text;
    let arr: string[] | undefined = pre?.split("\n");
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === "" && arr[i + 1] !== "" && arr[i - 1] !== "") {
        arr.splice(i + 1, 0, ""); // Wstaw pusty ciąg za elementem pustym
        i++; // Przesuń wskaźnik o jeden, ponieważ dodaliśmy nowy pusty ciąg
      }
    }
    setSongArr(arr);
  }, [props.song.id]);
  const changeSemiTones = (ev: number) => {
    if (props.inDb) {
      const songToUpdate = props.song;
      const newUpdate = {
        semitones: `${ev}`,
        added: false,
        ...songToUpdate,
        id: props.id,
      };
      update(newUpdate);
    }
  };
  return (
    <div className="song page-break" ref={textRef}>
      <div className="song__title">
        {!props.isPrintMode && (
          <TransposeControl
            semitones={semitones}
            onSemitonesChange={changeSemiTones}
          ></TransposeControl>
        )}
        {songItem && <h3>{songItem.title}</h3>}
      </div>
      <div className="song__items"  style={columnCountStyle}>
        {songArr &&
          songArr.map((songEl, index) => (
            <div className="song__item" key={songEl + index}>
              {index % 2 === 0 && <Chords>{songEl}</Chords> }
              {songEl === "" && index % 2 !== 0 && <br/>}
             {index % 2 !== 0 &&  <Lyrics>{songEl}</Lyrics> }
            </div>
          ))}
      </div>
    </div>
  );
};
