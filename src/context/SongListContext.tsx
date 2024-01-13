import { createContext, useContext, useState } from "react";
import { SongListLeft, SongToAddLeft } from "../models/SongListLeft.model";
import { SongListRight } from "../models/SongListRight.model";
import { useSongsDbContext } from "./firebaseContext";

const SongListContext: React.Context<any> = createContext([]);

export const SonglistProvider: React.FC<any> = ({ children }) => {
  const {
    getSongListDb,
    getSongDb,
    updateSongDb,
    addSongDb,
    getChoosenDb,
    addChoosenDb,
    deleteSongDb,
    deleteChoosenDb,
    updateChoosenDb,
    updateSemitones
  } = useSongsDbContext();
  const [songListRight, setSongListRight] = useState<SongListRight[]>([]);
  const [songListLeft, setSongListLeft] = useState<SongListLeft[]>([]);

  async function addSongListLeft(song: SongToAddLeft) {
   const id = await addSongDb(song);
    console.log(song);
    const songToAdd: SongListLeft = {
      ...song,
      id,
    };
    setSongListLeft([...songListLeft, songToAdd]);
  }

  function updateSongLists(song: SongListRight, semitones: number) {
    updateRight(song);
    updateLeft(song, semitones);
  }

  const updateLeft = (song: SongListRight, semitones: number) =>{
    const songToAdd: SongListLeft = {
      category: song.category,
      title: song.title,
      id: song.id,
      semitones,
      added: songListRight?.some((item: SongListRight) => item.id === song.id)
    };
    const updateLeft = songListLeft.map((el) => {
      if (el.id === songToAdd.id) {
        return songToAdd;
      }
      return el;
    });
    console.log('updateLeft', updateLeft)
    setSongListLeft([...updateLeft]);
  }

  const updateRight = (song: SongListRight) =>{
    const updateIndex = songListRight.findIndex(el => song.id === el.id);
    if (updateIndex !== -1){
      songListRight[updateIndex] = song;
      setSongListRight([...songListRight]);
    } else {
      setSongListRight([...songListRight, song]);
    }

  }


  function deleteSongFromLeft(id: string) {
    const updatedAllList = songListLeft.filter((el) => el.id !== id);
    setSongListLeft(updatedAllList);
  }
  function deleteSongFromRight(id: string) {
    const updatedAllList = songListRight.filter((el) => el.id !== id);
    setSongListRight(updatedAllList);
  }

  const removeSong = async (song: SongListRight, semitones: number) => {
      const songRighIndex =  songListRight.findIndex(el => el.id === song.id);
      const songToDelete: SongListLeft = {
        id: song.id,
        category: song.category,
        title: song.title,
        semitones
      };
      if(songRighIndex !== -1){
       await deleteChoosenDb(song);
       deleteSongFromRight(song.id);
      }
      await deleteSongDb(songToDelete);
      deleteSongFromLeft(song.id)
  }


  const getSongListAdmin = () => {
    getSongListDb().then((res: SongListLeft[]) => {
      getChoosenDb().then((songs: SongListRight[]) => {
        const updatedChoosenList = res?.map((song) => {
          const isAdded = songs?.some((item: SongListRight) => item.id === song.id);
          return {
            ...song,
            added: isAdded,
            semitones: song.semitones
          };
        });
        console.log('updatedChoosenList', updatedChoosenList)
        console.log('songs', songs)
        console.log('res', res)
        setSongListLeft(updatedChoosenList || []);
        setSongListRight(songs);
      });
    });
  };

  function addSongRight(song: SongListLeft) {
    getSongDb(song.id).then((item) => {
      console.log(song);
      const songToAdd: SongListRight = {
        id: song.id,
        title: item.title,
        category: item.category,
        text: item.text,
      };
      addChoosenDb(songToAdd).then((res) => {
        updateRight(songToAdd);
        updateAddedValue(song.id, true);
      });
    });
  }

  function updateAddedValue(id: string, added: boolean){
    const updatedAllList = songListLeft.map((el) => {
      if (el.id === id) {
        return { ...el, added };
      }
      return el;
    });
    setSongListLeft(updatedAllList);
  }

  function removeSongRight(song: SongListRight) {
    deleteChoosenDb(song).then((res) => {
      console.log('idddd remove', song)
     deleteSongFromRight(song.id)
      updateAddedValue(song.id, false);
    });
  }
  function updateSongsRight(song: SongListRight, semitones: number) {
    updateChoosenDb(song).then(() =>{
      updateSongLists(song, semitones);
    })
  }
  async function editSong(song: SongListRight, semitones: number) {
    console.log('songToedit', song);
    const checkIfInRight = songListRight.find(el => el.id === song.id);
    await updateSongDb(song, semitones);
    if(checkIfInRight){
      await updateChoosenDb(song);
    }
    updateSongLists(song, semitones);
  }
  async function updateSong(song: SongListRight, semitones: number) {
    console.log('songToedit', song);
    await updateSemitones(song, semitones);
    updateLeft(song, semitones);
  }
  

  return (
    <SongListContext.Provider
      value={{
        updateSongLists,
        getSongListAdmin,
        addSongRight,
        removeSongRight,
        removeSong,
        editSong,
        updateSongsRight,
        addSongListLeft,
        updateSong,
        songListLeft,
        songListRight
      }}
    >
      {children}
    </SongListContext.Provider>
  );
};

export const useSongListContext = () => useContext(SongListContext);
