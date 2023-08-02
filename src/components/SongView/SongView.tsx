import { useEffect, useState } from "react";
import { SongItem } from "../../constans/songList";
import { Chords } from "../Chords/Chords";
import Lyrics from "../Lyrics/Lyrics";
import { useTransposeContext } from "../../context/TransposeContext";
import { TransposeControl } from "../TranponseControl/TransposeControl";


export const SongView: React.FC<{song:SongItem | undefined, isPrintMode?: boolean}> = (song, isPrintMode = false) => {
    const [songArr, setSongArr] = useState<string[] | undefined>([]);
    const [title, setTitle] = useState<string | undefined>('');
    const { semitones, setValue } = useTransposeContext();

    useEffect(() => {
        const songItem = song.song;
        const pre = songItem?.text;
        setTitle(songItem?.title);
        let arr: string[] | undefined = pre?.split("\n");
        setSongArr(arr);
      }, [song])
    const changeSemiTones = (ev: number)=>{
        console.log(ev)
    }
    return (
        <div className="song">
        <div className="song__title page-break">
          <p>{title}</p>
        { !song.isPrintMode && <TransposeControl semitones={semitones} onSemitonesChange={changeSemiTones}></TransposeControl> }
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
}