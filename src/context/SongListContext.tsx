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
  const {
    getSongListDb,
    getSongDb,
    updateSongDb,
    getChoosenDb,
    addChoosenDb,
    deleteChoosenDb,
    updateChoosenDb,
  } = useSongsDbContext();
  const [songItemList, setSongList] = useState<SongPageItem[]>([]);
  const [allSongList, setAllSongList] = useState<SongItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>();
  const user = auth.currentUser;

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

  function editSongList(song: SongPageItem) {
    const songToAdd: SongItem = {
      category: song.category,
      title: song.title,
      added: !!songItemList.find((x: SongItem) => x.id === song.id) || false,
      id: song.id,
    };

    const updateAllSong = allSongList.map((el) => {
      if (el.id === song.id) {
        return songToAdd;
      }
      return el;
    });
    const updateSongs = songItemList.map((el) => {
      if (el.id === song.id) {
        return { ...song, id: song.id };
      }
      return el;
    });

    setAllSongList([...updateAllSong]);
    setSongList([...updateSongs]);
  }


  function deleteSongFromList(id: string) {
    const updatedAllList = allSongList.filter((el) => el.id !== id);
    setAllSongList(updatedAllList);
  }


  const getSongListAdmin = () => {
    getSongListDb().then((res: SongListItem[]) => {
      getChoosenDb().then((songs: SongPageItem[]) => {
        const updatedChoosenList = res?.map((song) => {
          const isAdded = songs?.some((item: SongPageItem) => item.songId === song.id);
          return {
            ...song,
            added: isAdded,
          };
        });
        // add to panle left
        setAllSongList(updatedChoosenList || []);
        // add to panel left
        setSongList(songs || []);
      });
    });
  };

  function addSongAdmin(song: SongItem) {
    getSongDb(song.id).then((item) => {
      console.log(song);
      const songToAdd: SongPageItem = {
        ...song,
        semitones,
        text: item.text,
        // songId: song.id
      };
      addChoosenDb(songToAdd).then((res) => {
        // add to panel right
        console.log('idddd Ad', res)
        setSongList([{ ...songToAdd }, ...songItemList]);
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

  function removeSongAdmin(song: SongPageItem) {
    deleteChoosenDb(song.id).then((res) => {
      console.log('idddd remove', song)
      const updatedSongs = songItemList.filter((item) => {
        return song.id !== item.id;
      });
      setSongList(updatedSongs);
      const updatedAllList = allSongList.map((el) => {
        if (el.id === song.songId) {
          return { ...el, added: false };
        }
        return el;
      });
      setAllSongList(updatedAllList);
    });
  }
  function updateSongAdmin(song: SongPageItem) {
    updateChoosenDb(song).then(() =>{
      editSongList(song);
    })
  }

  return (
    <SongListContext.Provider
      value={{
        songItemList,
        allSongList,
        deleteSongFromList,
        updateSongList,
        editSongList,
        setSelectedIndex,
        selectedIndex,
        getSongListAdmin,
        addSongAdmin,
        removeSongAdmin,
        updateSongAdmin
      }}
    >
      {children}
    </SongListContext.Provider>
  );
};

export const useSongListContext = () => useContext(SongListContext);
