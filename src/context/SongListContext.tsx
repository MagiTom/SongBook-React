import { createContext, useContext, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { SongItem, SongListItem, SongPageItem } from "../constans/songList";
import { useTransposeContext } from "./TransposeContext";
import { useSongsDbContext } from "./firebaseContext";

const SongListContext: React.Context<any> = createContext([]);

export const SonglistProvider: React.FC<any> = ({ children }) => {
  const { getAll, add, deleteRecord } = useIndexedDB("songs");
  const { semitones } = useTransposeContext();
  const { getSongListDb, getSongDb } = useSongsDbContext();
  const [songItemList, setSongList] = useState<SongPageItem[]>([]);
  const [allSongList, setAllSongList] = useState<SongItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>();

  function addSong(song: SongItem) {
    getSongDb(song.id).then((item) => {
      console.log(song);
      const songToAdd: SongPageItem = {
        ...song,
        semitones,
        text: item.text,
      };
      add(songToAdd).then((res) => {
        setSongList([{ ...songToAdd, id: `${res}` }, ...songItemList]);
        const updatedSongs = allSongList.map((el) => {
          if (el.id === song.id) {
            return { ...el, added: true };
          }
          return el;
        });
        setAllSongList(updatedSongs);
      });
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

  useEffect(function () {
    getSongList();
  }, []);

  const getSongList = () => {
    getSongListDb().then((res: SongListItem[]) => {
      getAll().then((songs: SongPageItem[]) => {
        const updatedChoosenList = res.map((song) => {
          const isAdded = songs.some((item: SongItem) => item.id === song.id);
          return {
            ...song,
            added: isAdded,
          };
        });
        setAllSongList(updatedChoosenList);
        setSongList(songs);
      });
    });
  };

  return (
    <SongListContext.Provider
      value={{
        addSong,
        removeSong,
        songItemList,
        allSongList,
        deleteSongFromList,
        updateSongList,
        deleteFromAllList,
        editSongList,
        setSelectedIndex,
        selectedIndex,
      }}
    >
      {children}
    </SongListContext.Provider>
  );
};

export const useSongListContext = () => useContext(SongListContext);
