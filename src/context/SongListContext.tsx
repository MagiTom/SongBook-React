import { createContext, useContext, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { SongItem, SongListItem, SongPageItem } from "../constans/songList";
import { useTransposeContext } from "./TransposeContext";
import { useSongsDbContext } from "./firebaseContext";
import { auth } from "../firebase-config";

const SongListContext: React.Context<any> = createContext([]);

export const SonglistProvider: React.FC<any> = ({ children }) => {
  const { getAll, add, deleteRecord } = useIndexedDB("songs");
  const { semitones } = useTransposeContext();
  const { getSongListDb, getSongDb, updateSongDb } = useSongsDbContext();
  const [songItemList, setSongList] = useState<SongPageItem[]>([]);
  const [allSongList, setAllSongList] = useState<SongItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>();
  const user = auth.currentUser;

  function addSong(song: SongItem) {
    getSongDb(song.id).then((item) => {
      console.log(song);
      const songToAdd: SongPageItem = {
        ...song,
        semitones,
        text: item.text,
      };
      add(songToAdd).then((res) => {
        // add to panel right
        setSongList([{ ...songToAdd, id: `${res}` }, ...songItemList]);
        const updatedSongs = allSongList.map((el) => {
          if (el.id === songToAdd.id) {
            return { ...el, added: true };
          }
          return el;
        });
         // add to panel left
        setAllSongList(updatedSongs);
      });
    });
  }

  function updateSongAdmin(song: SongItem, added: boolean, deleteMode = false) {
    getSongDb(song.id).then((item) => {
      console.log(song);
      const songToAdd: SongPageItem = {
        ...song,
        semitones,
        text: item.text,
        added,
        id: item.id
      };

      updateSongDb(song.id, songToAdd).then(() =>{
        const updateAllSong = allSongList.map((el) => {
          if (el.id === song.id) {
            return songToAdd;
          }
          return el;
        });
        setAllSongList([...updateAllSong]);
        if(deleteMode){
          const updatedSongs = songItemList.filter((item) => {
            return song.id !== item.id;
          });
          setSongList(updatedSongs);
        }  else {
          setSongList([...songItemList, songToAdd]);
        }
      })

      // add(songToAdd).then((res) => {
      //   // add to panel right
      //   setSongList([{ ...songToAdd, id: `${res}` }, ...songItemList]);
      //   const updatedSongs = allSongList.map((el) => {
      //     if (el.id === songToAdd.id) {
      //       return { ...el, added: true };
      //     }
      //     return el;
      //   });
      //    // add to panel left
      //   setAllSongList(updatedSongs);
      // });
    });
  }

  function updateSongList(song: SongItem) {
    console.log(song);
    const songToAdd: SongItem = {
      category: song.category,
      title: song.title,
      added: false,
      id: song.id,
    };
    setAllSongList([...allSongList, songToAdd]);
  }

  function editSongList(song: SongPageItem, id: string) {
    const songToAdd: SongItem = {
      category: song.category,
      title: song.title,
      added: !!songItemList.find((x: SongItem) => x.id === id) || false,
      id,
    };

    const updateAllSong = allSongList.map((el) => {
      if (el.id === id) {
        return songToAdd;
      }
      return el;
    });
    const updateSongs = songItemList.map((el) => {
      if (el.id === id) {
        return { ...song, id };
      }
      return el;
    });

    setAllSongList([...updateAllSong]);
    setSongList([...updateSongs]);
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

  function deleteFromAllList(id: string) {
    deleteRecord(id).then(() => {
      const updatedSongs = songItemList.filter((item) => {
        return id !== item.id;
      });
      setSongList(updatedSongs);
      deleteSongFromList(id);
    });
  }

  function deleteSongFromList(id: string) {
    const updatedAllList = allSongList.filter((el) => el.id !== id);
    setAllSongList(updatedAllList);
  }

  const getSongList = () => {
    getSongListDb().then((res: SongPageItem[] | any[]) => {
      getAll().then((songs: SongPageItem[]) => {
        const updatedChoosenList = res.map((song) => {
          const isAdded = songs.some((item: SongItem) => item.id === song.id);
          return {
            ...song,
            added: isAdded,
          };
        });
        // add to panle left
        setAllSongList(updatedChoosenList);
        // add to panel left
        setSongList(songs);
      });
    });
  };

  const getSongListAdmin = () => {
    getSongListDb().then((res: SongPageItem[]) => {
      // add to panle left
      setAllSongList(res);
      const panelLeftList = res.filter(item => item?.added)
      // add to panel left
      setSongList(panelLeftList);
    });
  };


  return (
    <SongListContext.Provider
      value={{
        addSong,
        removeSong,
        getSongList,
        songItemList,
        allSongList,
        deleteSongFromList,
        updateSongList,
        deleteFromAllList,
        editSongList,
        setSelectedIndex,
        selectedIndex,
        updateSongAdmin,
        getSongListAdmin
      }}
    >
      {children}
    </SongListContext.Provider>
  );
};

export const useSongListContext = () => useContext(SongListContext);
