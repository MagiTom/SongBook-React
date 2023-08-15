import { createContext, useState, useEffect, useContext } from 'react';
import { useIndexedDB } from "react-indexed-db-hook";
import { SongItem, SongList } from '../constans/songList';
import { useTransposeContext } from './TransposeContext';

const SongListContext: React.Context<any> = createContext([]);

export const SonglistProvider: React.FC<any> = ({ children }) =>{
    const { getAll, add, deleteRecord } = useIndexedDB('songs');
    const { semitones } = useTransposeContext();
    const [songItemList, setSongList] = useState<SongItem[]>([]);
    const [allSongList, setAllSongList] = useState<SongItem[]>([]);
    const songList = SongList;

    function addSong(song: SongItem) {
        console.log(song);
        const songToAdd: SongItem = {
          ...song, semitones 
        }
        add(songToAdd).then(res => {
          setSongList([{...songToAdd, id: `${res}`}, ...songItemList]);
          const updatedSongs = allSongList.map((el) => {
            if (el.id === song.id) {
              return { ...el, added: true };
            }
            return el;
          });
          setAllSongList(updatedSongs);
        });
   
      }
  
      function removeSong(song: SongItem) {
        deleteRecord(song.id).then(() => {
          const updatedSongs = songItemList.filter((item) => {
            return song.id !== item.id;
          });
          setSongList(updatedSongs);
          const updatedAllList = allSongList.map((el) => {
            if (el.id === song.id) {
              return { ...el, added: false };
            }
            return el;
          });
          setAllSongList(updatedAllList);
        });
      }

      useEffect(function () {
        getSongList();
      }, []);
    
      const getSongList = () => {
        getAll().then((songs: SongItem[]) => {
          console.log('all', songs)
          const updatedChoosenList = songList.map((song) => {
            const isAdded = songs.some((item: SongItem) => item.id === song.id);
            return {
              ...song,
              added: isAdded,
            };
          });
          setAllSongList(updatedChoosenList);
          setSongList(songs);
        });
      }

    return(
        <SongListContext.Provider  value={{addSong, removeSong, songItemList, allSongList }}>
        {children}
        </SongListContext.Provider>
    )
}

export const useSongListContext = () => useContext(SongListContext);

