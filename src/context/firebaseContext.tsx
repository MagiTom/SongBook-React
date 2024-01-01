import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useState } from "react";
import { Category } from "../constans/categories";
import {
  SongItem,
  SongListItem,
  SongPageItem,
  SongToAdd,
} from "../constans/songList";
import { db } from "../firebase-config";
import { useErrorContext } from "./ErrorContext";

export interface SongsDbModel {
  songListDb: SongListItem[] | undefined;
  categoriesDb: Category[];
  addSongDb: (song: SongToAdd) => Promise<void>;
  getSongDb: (id: string) => Promise<SongListItem | any>;
  deleteSongDb: (docId: string, textId: string) => Promise<void>;
  updateSongDb: (docId: string, song: SongPageItem) => Promise<void>;
  getSongListDb: () => Promise<SongPageItem[]>;
  getCategoriesDb: () => Promise<void>;
  addCategoryDb: (category: Category) => Promise<void>;
  deleteCategoryDb: (id: string) => Promise<void>;
}

const SongsDbContext = React.createContext<SongsDbModel>({
  songListDb: [],
  categoriesDb: [],
  addSongDb: () => Promise.resolve(),
  getSongDb: () => Promise.resolve(null),
  deleteSongDb: () => Promise.resolve(),
  updateSongDb: () => Promise.resolve(),
  getCategoriesDb: () => Promise.resolve(),
  addCategoryDb: () => Promise.resolve(),
  deleteCategoryDb: () => Promise.resolve(),
  getSongListDb: () => Promise.resolve([]),
});

export const SongsDbProvider: React.FC<any> = ({ children }) => {
  const [songListDb, setSongListDb] = useState<SongListItem[] | undefined>();
  const [categoriesDb, setCategoriesDb] = useState<Category[]>([]);
  const collectionRef = collection(db, "songs");
  const collectionCategoryRef = collection(db, "categories");
  const { addError } = useErrorContext();

  const getCategoriesDb = async (): Promise<void> => {
    getDocs(collectionCategoryRef)
      .then((todo) => {
        let data: Category[] | any[] = todo.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCategoriesDb(data);
      })
      .catch((err) => {
        console.log(err);
        addError(err?.message);
      });
  };

  const addCategoryDb = async (category: Category) => {
    await addDoc(collectionCategoryRef, {
      ...category,
    })
      .then((res) => {
        setCategoriesDb([{ ...category, id: res.id }, ...categoriesDb]);
      })
      .catch((err) => addError(err?.message));
  };
  const deleteCategoryDb = async (id: string) => {
    const documentRef = doc(db, "categories", id);
    await deleteDoc(documentRef).catch((err) => addError(err?.message));
    setCategoriesDb(categoriesDb.filter((item) => item.id !== id));
  };

  const getSongDb = async (id: string) => {
    const docRef = doc(db, "songs", id);
    const docSnap = getDoc(docRef);
    const songRef = collection(db, `songs/${docRef.id}/${docRef.id}`);
    return getDocs(songRef)
      .then(async (todo) => {
        let data = todo.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const songToDb: SongItem | any = {
          ...(await docSnap).data(),
          ...data[0],
        };
        return songToDb;
      })
      .catch((err) => addError(err?.message));
  };

  const addSongDb = async (song: SongToAdd) => {
    const songToAdd = {
      category: song.category,
      title: song.title,
    };
    try {
      return addDoc(collectionRef, songToAdd).then(async (res: any) => {
        const questionRef = collection(db, `songs/${res.id}/${res.id}`);
        await addDoc(questionRef, { text: song.text, title: song.title });
        setSongListDb([...(songListDb || []), { ...songToAdd, id: res.id }]);
        return res.id;
      });
    } catch (err: any) {
      addError(err?.message);
    }
  };

  const deleteSongDb = async (docId: string, textId: string) => {
    try {
      const documentRef = doc(db, "songs", docId);
      const questionRef = collection(db, `songs/${docId}/${docId}`);
      const documentRef2 = doc(questionRef, textId);
      await deleteDoc(documentRef2);
      await deleteDoc(documentRef);
      setSongListDb(songListDb?.filter((item) => item.id !== docId));
    } catch (err: any) {
      addError(err?.message);
    }
  };

  const updateSongDb = async (docId: string, song: SongPageItem) => {
    try {
      const songToAdd = {
        category: song.category,
        title: song.title,
        added: song?.added,
        text: song?.text,
        semitones: song?.semitones
      };
      const documentRef = doc(db, "songs", docId);
      const questionRef = collection(db, `songs/${docId}/${docId}`);
      const documentRef2 = doc(questionRef, song.id);
      await updateDoc(documentRef, songToAdd);
      await updateDoc(documentRef2, { text: song.text, title: song.title });
      setSongListDb([...(songListDb || []), { ...songToAdd, id: docId }]);
    } catch (err: any) {
      addError(err?.message);
    }
  };

  const getSongListDb = async (): Promise<SongPageItem[]> => {
    return getDocs(collectionRef)
      .then((todo) => {
        let data: SongPageItem[] | any[] = todo.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setSongListDb(data);
        return data;
      })
      .catch((err: any) => {
        addError(err?.message);
        return [];
      });
  };

  return (
    <SongsDbContext.Provider
      value={{
        songListDb,
        categoriesDb,
        deleteCategoryDb,
        addCategoryDb,
        getCategoriesDb,
        addSongDb,
        deleteSongDb,
        updateSongDb,
        getSongListDb,
        getSongDb,
      }}
    >
      {children}
    </SongsDbContext.Provider>
  );
};

export const useSongsDbContext = () => useContext(SongsDbContext);
