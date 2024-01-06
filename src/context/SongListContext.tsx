import { createContext, useContext, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { SongItem, SongListItem, SongPageItem, SongToAdd } from "../constans/songList";
import { useTransposeContext } from "./TransposeContext";
import { useSongsDbContext } from "./firebaseContext";
import { auth } from "../firebase-config";
import { SongListRight } from "../models/SongListRight.model";
import { FullSong, SongListLeft, SongToUpdate } from "../models/SongListLeft.model";

const SongListContext: React.Context<any> = createContext([]);

export const SonglistProvider: React.FC<any> = ({ children }) => {
  const { getAll, add, deleteRecord } = useIndexedDB("songs");
  const { semitones } = useTransposeContext();
  const {
    getSongListDb,
    getSongDb,
    updateSongDb,
    addSongDb,
    getChoosenDb,
    addChoosenDb,
    deleteChoosenDb,
    updateChoosenDb,
  } = useSongsDbContext();
  const [songListRight, setSongListRight] = useState<SongListRight[]>([]);
  const [songListLeft, setSongListLeft] = useState<SongListLeft[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>();
  const user = auth.currentUser;

  async function addSongListLeft(song: SongToAdd) {
   const id = await addSongDb(song);
    console.log(song);
    const songToAdd: SongListLeft = {
      category: song.category,
      title: song.title,
      added: !!songListRight.find((x: SongListRight) => x.id === id) || false,
      id,
    };
    setSongListLeft([...songListLeft, songToAdd]);
  }

  function updateSongLists(song: SongListRight) {
    const songToAdd: SongListLeft = {
      category: song.category,
      title: song.title,
      id: song.id,
      added: !!songListRight.find((x: SongItem) => x.id === song.id) || false
    };

    const updateLeft = songListLeft.map((el) => {
      if (el.id === song.id) {
        return songToAdd;
      }
      return el;
    });
    const updateRight = songListRight.map((el) => {
      if (el.id === song.id) {
        return { ...song };
      }
      return el;
    });

    setSongListLeft([...updateLeft]);
    setSongListRight([...updateRight]);
  }

  const updateLeft = (songToAdd: SongListLeft) =>{
    const updateLeft = songListLeft.map((el) => {
      if (el.id === songToAdd.id) {
        return songToAdd;
      }
      return el;
    });
    setSongListLeft([...updateLeft]);
  }

  const updateRight = (song: SongListRight) =>{
    const updateRight = songListRight.map((el) => {
      if (el.id === song.id) {
        return { ...song };
      }
      return el;
    });
    setSongListRight([...updateRight]);
  }


  function deleteSongFromLeft(id: string) {
    const updatedAllList = songListLeft.filter((el) => el.id !== id);
    setSongListLeft(updatedAllList);
  }

  const removeSong = () => {

  }


  const getSongListAdmin = () => {
    getSongListDb().then((res: SongListItem[]) => {
      getChoosenDb().then((songs: SongListRight[]) => {
        const updatedChoosenList = res?.map((song) => {
          const isAdded = songs?.some((item: SongListRight) => item.id === song.id);
          return {
            ...song,
            added: isAdded,
          };
        });
        setSongListLeft(updatedChoosenList || []);
        setSongListRight(songs);
      });
    });
  };

  function addSongRight(song: SongToUpdate) {
    getSongDb(song.id).then((item) => {
      console.log(song);
      const songToAdd: SongListRight = {
        ...song,
        semitones,
        text: item.text,
        // songId: song.id
      };
      addChoosenDb(songToAdd).then((res) => {
        updateSongLists(songToAdd)
      });
    });
  }

  function removeSongRight(song: SongListRight) {
    deleteChoosenDb(song).then((res) => {
      console.log('idddd remove', song)
      const updatedSongs = songListRight.filter((item) => {
        return song.id !== item.id;
      });
      setSongListRight(updatedSongs);
      const updatedAllList = songListLeft.map((el) => {
        if (el.id === song.id) {
          return { ...el, added: false };
        }
        return el;
      });
      setSongListLeft(updatedAllList);
    });
  }
  function updateSongsRight(song: SongListRight) {
    updateChoosenDb(song).then(() =>{
      updateSongLists(song);
    })
  }
  function editSong(song: SongListRight) {
    console.log('songToedit', song);
    updateSongDb(song).then(() =>{
      updateSongLists(song);
    })
  }

  return (
    <SongListContext.Provider
      value={{
        updateSongLists,
        getSongListAdmin,
        addSongRight,
        removeSongRight,
        editSong,
        updateSongsRight,
        addSongListLeft,
        songListLeft,
        songListRight
      }}
    >
      {children}
    </SongListContext.Provider>
  );
};

export const useSongListContext = () => useContext(SongListContext);
