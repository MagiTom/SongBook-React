import { useEffect, useState } from "react";
import { SongItem, SongPageItem } from "../../constans/songList";
import { Chords } from "../Chords/Chords";
import Lyrics from "../Lyrics/Lyrics";
import { useTransposeContext } from "../../context/TransposeContext";
import { TransposeControl } from "../TranponseControl/TransposeControl";
import SongTitle from "../SongTitle/SongTitle";
import "./style.scss";
import { useIndexedDB } from "react-indexed-db-hook";

export const SongView: React.FC<{song: SongPageItem, inDb: boolean, id: string, isPrintMode?: boolean}> = (props, inDb = false, isPrintMode = false) => {
    const [songArr, setSongArr] = useState<string[] | undefined>([]);
    const [songItem, setSongItem] = useState<SongPageItem>();
    const { update, getByID } = useIndexedDB('songs');
    const { semitones, setValue } = useTransposeContext();

    useEffect(() => {
        const songItemEl = props.song;
        setSongItem(songItemEl);
        const pre = songItemEl?.text;
        let arr: string[] | undefined = pre?.split("\n");
        console.log('songItemEl', arr)
        console.log('isPrintMode', isPrintMode)
        setSongArr(arr);

        // getByID(props.song?.id).then((fromDb) => {
        //   console.log('fromDb', fromDb)
        //   setSongDB(fromDb);
        //   if(fromDb){
        //     setValue(+fromDb?.semitones);
        //   }else {
        //     setValue(0);
        //   }
        // });


      }, [props.song.id])
    const changeSemiTones = (ev: number)=>{
   
      console.log('semitones', ev)
      if (props.inDb) {
        const songToUpdate = props.song;
        const newUpdate = { semitones: `${ev}`, added: false, ...songToUpdate, id: props.id };
        console.log('newUpdate', newUpdate)
        update(newUpdate);
      }
    }
    return (
        <div className="song page-break">
        <div className="song__title">
        { !props.isPrintMode && <TransposeControl semitones={semitones} onSemitonesChange={changeSemiTones}></TransposeControl> }
         {songItem && <h3>{songItem.title}</h3>}

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