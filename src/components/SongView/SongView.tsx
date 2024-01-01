import { useEffect, useRef, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { SongPageItem } from "../../constans/songList";
import { useTransposeContext } from "../../context/TransposeContext";
import { Chords } from "../Chords/Chords";
import Lyrics from "../Lyrics/Lyrics";
import { TransposeControl } from "../TranponseControl/TransposeControl";
import "./style.scss";

export const SongView: React.FC<{
  song: SongPageItem;
  inDb: boolean;
  id: string;
  isPrintMode?: boolean;
}> = (props) => {
  const [songArr, setSongArr] = useState<string[] | undefined>([]);
  const [songItem, setSongItem] = useState<SongPageItem>();
  const { update } = useIndexedDB("songs");
  const { semitones } = useTransposeContext();
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

  const columnCountStyle = isOverflowing
    ? { columnCount: 2 }
    : { columnCount: 1 };

  useEffect(() => {
    const songItemEl = props.song;
    setSongItem(songItemEl);
    const pre = songItemEl?.text;
    let arr: string[] | undefined = pre?.split("\n");
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === "" && arr[i + 1] !== "" && arr[i - 1] !== "") {
        arr.splice(i + 1, 0, "");
        i++;
      }
    }
    setSongArr(arr);
  }, [props.song]);
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
      <div className="song__items" style={columnCountStyle}>
        {songArr &&
          songArr.map((songEl, index) => (
            <div className="song__item" key={songEl + index}>
              {(index % 2 === 0 || songEl.includes('/')) && <Chords>{songEl}</Chords>}
              {songEl === "" && index % 2 !== 0 && <br />}
              {index % 2 !== 0 && !songEl.includes('/') && <Lyrics>{songEl}</Lyrics>}
            </div>
          ))}
      </div>
    </div>
  );
};
