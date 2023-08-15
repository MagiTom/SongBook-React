import { useEffect, useState } from "react";
import { SongItem } from "../../constans/songList";
import { Chords } from "../Chords/Chords";
import Lyrics from "../Lyrics/Lyrics";
import { useTransposeContext } from "../../context/TransposeContext";
import { TransposeControl } from "../TranponseControl/TransposeControl";
import SongTitle from "../SongTitle/SongTitle";


export const SongView: React.FC<{song:SongItem, isPrintMode?: boolean}> = (props, isPrintMode = false) => {
    const [songArr, setSongArr] = useState<string[] | undefined>([]);
    const [songItem, setSongItem] = useState<SongItem>();
    const { semitones } = useTransposeContext();

    useEffect(() => {
        const songItemEl = props.song;
        setSongItem(songItemEl);
        const pre = songItemEl?.text;
        let arr: string[] | undefined = pre?.split("\n");
        setSongArr(arr);
      }, [props])
    const changeSemiTones = (ev: number)=>{
        console.log(ev)
    }
    return (
        <div className="song page-break">
        <div className="song__title">
         <p>{songItem && <SongTitle goToPage={()=> {}} key={songItem?.id} addSongToList={()=>{}} song={songItem} />}</p>
        { !props.isPrintMode && <TransposeControl semitones={semitones} onSemitonesChange={changeSemiTones}></TransposeControl> }
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