import React, { useContext, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { SongItem, SongPageItem } from "../constans/songList";
import { useErrorContext } from "./ErrorContext";

export interface IndexedDbModel {
  songList: SongItem[] | undefined;
  handleInitDB: () => Promise<void>;
  addSong: (song: SongPageItem) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  updateSong: (id: string, updatedSong: SongItem) => Promise<void>;
  getSongList: () => Promise<void>;
}

const IndexedDbContext = React.createContext<IndexedDbModel>({
  songList: [],
  handleInitDB: () => Promise.resolve(),
  addSong: () => Promise.resolve(),
  deleteSong: () => Promise.resolve(),
  updateSong: () => Promise.resolve(),
  getSongList: () => Promise.resolve(),
});

export const IndexedDbProvider: React.FC<any> = ({ children }) => {
  const { getAll, add, deleteRecord } = useIndexedDB("songs");
  const [songList, setSongList] = useState<SongItem[] | undefined>();
  const { addError } = useErrorContext();
  const handleInitDB = async () => {};

  const addSong = async (song: SongPageItem) => {
    const songToAdd = {
      id: Date.now().toString(),
      title: song.title,
      text: song.text,
      semitones: song.semitones,
    };

    try {
      console.log(song);
      add(songToAdd).then((res) => {
        getSongList();
        console.log(res);
      });
    } catch (err: any) {
      addError(err?.message);
    }
  };

  const deleteSong = async (id: string) => {
    try {
      console.log(id);
      deleteRecord(id).then((event) => {
        console.log(event);
        getSongList();
      });
    } catch (err: any) {
      addError(err?.message);
    }
  };

  const updateSong = async (id: string, updatedSong: SongItem) => {
    try {
      getSongList();
    } catch (err: any) {
      addError(err?.message);
    }
  };

  const getSongList = async () => {
    getAll()
      .then((songs: SongItem[]) => {
        setSongList(songs);
      })
      .catch((err: any) => addError(err?.message));
  };

  return (
    <IndexedDbContext.Provider
      value={{
        songList,
        handleInitDB,
        addSong,
        deleteSong,
        updateSong,
        getSongList,
      }}
    >
      {children}
    </IndexedDbContext.Provider>
  );
};

export const useIndexedDbContext = () => useContext(IndexedDbContext);
