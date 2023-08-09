import { createContext, useState, useEffect, useContext } from 'react';
import { useIndexedDB } from "react-indexed-db-hook";
import { SongItem } from '../constans/songList';
import { useTransposeContext } from './TransposeContext';

const SongListContext: React.Context<any> = createContext([]);

export const SonglistProvider: React.FC<any> = ({ children }) =>{
    const { getAll, add, deleteRecord } = useIndexedDB('songs');
    const { semitones } = useTransposeContext();
    const [songItemList, setSongList] = useState<SongItem[]>([]);

    function addSong(song: SongItem) {
        console.log(song);
        const songToAdd: SongItem = {
          ...song, semitones 
        }
        add(songToAdd).then(res => {
          setSongList([{...songToAdd, id: `${res}`}, ...songItemList]);
        });
   
      }
  
      function removeSong(song: SongItem) {
        deleteRecord(song.id).then((event) => {
          const updatedSongs = songItemList.filter((item) => {
            return song.id !== item.id;
          });
          setSongList(updatedSongs);
        });
      }

      useEffect(function () {
        getSongList();
      }, []);
    
      const getSongList = () => {
        getAll().then((songs: SongItem[]) => {
          console.log('all', songs)
          setSongList(songs);
        });
      }

    return(
        <SongListContext.Provider  value={{addSong, removeSong, songItemList }}>
        {children}
        </SongListContext.Provider>
    )
}

export const useSongListContext = () => useContext(SongListContext);

