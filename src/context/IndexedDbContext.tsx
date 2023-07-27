import React, { useContext, useState } from "react";
import { Stores, addData, deleteData, getStoreData, initDB, updateData } from '../lib/db';
import { SongItem } from "../constans/songList";


export interface IndexedDbModel {
  songList: SongItem[] | undefined,
  handleInitDB: () => Promise<void>,
  addSong: (song: SongItem) => Promise<void>,
  deleteSong: (id: string) => Promise<void>,
  updateSong: (id: string, updatedSong: SongItem) => Promise<void>,
  getSongList: () => Promise<void>,
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
  const [songList, setSongList] = useState<SongItem[] | undefined>();
  const handleInitDB = async () => {
    const status = await initDB();
    // setIsDBReady(!!status); // If needed, you can uncomment this line.
  };

  const addSong = async (song: SongItem) => {
    const songToAdd = {
      id: Date.now().toString(),
      title: song.title,
      text: song.text,
      semitones: song.semitones,
    };

    try {
      const res = await addData(Stores.SongList, songToAdd);
      // refetch songs after creating data
      getSongList();
    } catch (err: unknown) {
      if (err instanceof Error) {
        // setError(err.message); // You can use this to handle errors if needed.
      } else {
        // setError('Something went wrong');
      }
    }
  };

  const deleteSong = async (id: string) => {
    try {
      await deleteData(Stores.SongList, id);
      // refetch songs after deleting data
      getSongList();
    } catch (err: unknown) {
      if (err instanceof Error) {
        // setError(err.message); // You can use this to handle errors if needed.
      } else {
        // setError('Something went wrong deleting the song');
      }
    }
  };

  const updateSong = async (id: string, updatedSong: SongItem) => {
    try {
      await updateData(Stores.SongList, id, updatedSong);
      getSongList();
    } catch (err: unknown) {
      // Handle errors if needed.
    }
  };

  const getSongList = async () => {
    const songList: SongItem[] = await getStoreData<SongItem>(Stores.SongList);
    setSongList(songList);
  };

  // Call handleInitDB() to initialize the database when this component mounts
  React.useEffect(() => {
    handleInitDB();
  }, []);

  return (
    <IndexedDbContext.Provider
      value={{ songList, handleInitDB, addSong, deleteSong, updateSong, getSongList }}
    >
      {children}
    </IndexedDbContext.Provider>
  );
};

export const useIndexedDbContext = () => useContext(IndexedDbContext);