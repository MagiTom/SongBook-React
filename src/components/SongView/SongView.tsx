import { useEffect, useRef, useState } from "react";
import { useTransposeContext } from "../../context/TransposeContext";
import { Chords } from "../Chords/Chords";
import Lyrics from "../Lyrics/Lyrics";
import { TransposeControl } from "../TranponseControl/TransposeControl";
import "./style.scss";
import { useSongListContext } from "../../context/SongListContext";
import { SongListRight } from "../../models/SongListRight.model";
import { IconButton, Tooltip } from "@mui/material";
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';

export const SongView: React.FC<{
  song: SongListRight;
  id: string;
  isPrintMode?: boolean;
}> = (props) => {
  const [songArr, setSongArr] = useState<string[] | undefined>([]);
  const [songItem, setSongItem] = useState<SongListRight>();
  const { updateSong } = useSongListContext();
  const { semitones } = useTransposeContext();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<any>(null);

  const columnCountStyle = isOverflowing
    ? { columnCount: 2 }
    : { columnCount: 1 };


  useEffect(() => {
    const songItemEl = props.song;
    setSongItem(songItemEl);
    const pre = songItemEl?.text;
    let arr: string[] | undefined = pre?.split("\n");
    for (let i = 0; i < arr?.length - 1; i++) {
      if (
        arr[i].trim() === "" &&
        arr[i + 1].trim() !== "" &&
        arr[i - 1].trim() !== ""
      ) {
        arr.splice(i + 1, 0, "");
        i++;
      }
    }
    console.log("arr", arr);
    setSongArr(arr);
  }, [props.song]);
  const changeSemiTones = (ev: number) => {
    updateSong(props.song, ev);
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
        <Tooltip title="Podziel na dwie kolumny" arrow>
          <IconButton
            onClick={() => setIsOverflowing(!isOverflowing)}
            aria-label="split"
            color="primary"
          >
            <VerticalSplitIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className="song__items" style={columnCountStyle}>
        {songArr &&
          songArr.map((songEl, index) => (
            <div className="song__item" key={songEl + index}>
              {(index % 2 === 0 || songEl.includes("/")) && (
                <Chords>{songEl}</Chords>
              )}
              {/* {songEl.trim() === "" && index % 2 !== 0 && <br />} */}
              {index % 2 !== 0 && !songEl.includes("/") && (
                <Lyrics>{songEl}</Lyrics>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
