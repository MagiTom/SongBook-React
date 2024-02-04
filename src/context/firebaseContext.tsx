
import firebase from "firebase/compat/app";
import React, { useContext, useState } from "react";
import { Category } from "../constans/categories";
import {
  SongPageItem,
} from "../constans/songList";
import { db } from "../firebase-config";
import {
  SongListLeft,
  SongToAddLeft,
} from "../models/SongListLeft.model";
import { SongListRight } from "../models/SongListRight.model";
import { useErrorContext } from "./ErrorContext";

export interface User {
  email: string;
}

export interface SongsDbModel {
  categoriesDb: Category[];
  loading: boolean;
  addSongDb: (song: SongToAddLeft) => Promise<string>;
  getSongDb: (id: string) => Promise<SongListLeft | any>;
  deleteSongDb: (song: SongListLeft) => Promise<void>;
  updateSongDb: (song: SongListRight, semitones: number) => Promise<void>;
  updateSemitones: (song: SongListRight, semitones: number) => Promise<void>;
  getSongListDb: () => Promise<SongListLeft[]>;
  getChoosenDb: () => Promise<SongListRight[]>;
  addChoosenDb: (song: SongPageItem) => Promise<SongListRight[] | any[]>;
  deleteChoosenDb: (choosenSong: SongListRight) => Promise<void>;
  updateChoosenDb: (song: SongListRight) => Promise<void>;
  getCategoriesDb: () => Promise<void>;
  addCategoryDb: (category: Category) => Promise<void>;
  deleteCategoryDb: (category: Category) => Promise<void>;
  createUserDocument: (user: any) => Promise<void>;
  updateChoosenListDb: (songs: SongListRight[]) => Promise<void>;
}

const SongsDbContext = React.createContext<SongsDbModel>({
  categoriesDb: [],
  loading: false,
  addSongDb: () => Promise.resolve(''),
  getSongDb: () => Promise.resolve(null),
  deleteSongDb: () => Promise.resolve(),
  updateSongDb: () => Promise.resolve(),
  updateSemitones: () => Promise.resolve(),
  getCategoriesDb: () => Promise.resolve(),
  addCategoryDb: () => Promise.resolve(),
  deleteCategoryDb: () => Promise.resolve(),
  getSongListDb: () => Promise.resolve([]),
  getChoosenDb: () => Promise.resolve([]),
  addChoosenDb: () => Promise.resolve([]),
  deleteChoosenDb: () => Promise.resolve(),
  updateChoosenDb: () => Promise.resolve(),
  createUserDocument: () => Promise.resolve(),
  updateChoosenListDb: () => Promise.resolve(),
});

export const SongsDbProvider: React.FC<any> = ({ children }) => {
  const [categoriesDb, setCategoriesDb] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { addError } = useErrorContext();
  const user = firebase.auth().currentUser;

  const createUserDocument = async (user: any) => {
    if (user) {
      setLoading(true);
      const userRef = db.collection("users").doc(user.uid);
      const doc = await userRef.get();
      if (!doc.exists) {
        await userRef.set({
          email: user.email,
        });
      }
      setLoading(false);
    }
  };

  const getListDb = async (collection: string): Promise<any> => {
    const userAuth = firebase.auth().currentUser;
    if (userAuth) {
      setLoading(true);
      const userRef = db.collection("users").doc(userAuth.uid);
      try {
        const doc = await userRef.get();
        if (doc.exists) {
          const userData = doc.data();
          const listCol = userData?.[collection] || [];
          setLoading(false);
          return listCol;
        } else {
          setLoading(false);
          // eslint-disable-next-line
          throw ('Dokument użytkownika nie istnieje.')
        }
      } catch (error) {
        addError(error);
        setLoading(false);
        throw error;
      }
    }
  }

 const updateListDb = async (newList: any[], collection: string) =>{
  const userAuth = firebase.auth().currentUser;
  if (userAuth) {
    setLoading(true);
    const userRef = db.collection("users").doc(userAuth.uid);
    try {
      const doc = await userRef.get();
      if (doc.exists) {
        const userData = doc.data();
        if(userData){
        userData[collection] = newList;
        await userRef.update(userData);
        }
        setLoading(false);
      } else {
        setLoading(false);
        // eslint-disable-next-line
        throw 'Dokument użytkownika nie istnieje.';
      }
    } catch (error) {
      setLoading(false);
      addError(error);
      throw error;
    }
  }
 }

  const addElementToDb = async (element: any, collection: string): Promise<any> => {
    try {
      setLoading(true);
      const userRef = firebase.firestore().collection("users").doc(user?.uid);
      const newId = element?.id || userRef.collection(collection).doc().id;
      const updateEl = { ...element, id: newId };
      await userRef.update({
        [collection]: firebase.firestore.FieldValue.arrayUnion(updateEl),
      });
      setLoading(false);
      return updateEl;
    } catch (error) {
      setLoading(false);
      addError(error);
      throw error;
    }
  };

  const deleteElementDb = async (
    element: any,
    collection: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const userRef = firebase.firestore().collection("users").doc(user?.uid);
      await userRef.update({
        [collection]: firebase.firestore.FieldValue.arrayRemove(element),
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      addError(error);
      throw error;
    }
  };

  const updateElementDb = async (
    element: any,
    collection: string
  ): Promise<void> => {
    setLoading(true);
    const userRef = firebase.firestore().collection("users").doc(user?.uid);
    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      const userElements = userSnapshot.data()?.[collection];
      const index = userElements.findIndex(
        (item: any) => item.id === element.id
      );
      if (index !== -1) {
        userElements[index] = {
          ...userElements[index],
          ...element,
        };
        await userRef.update({
          [collection]: userElements,
        });
        setLoading(false);
      } else {
        setLoading(false);
        addError("Nie znaleziono piosenki o podanym ID.");
        // eslint-disable-next-line
        throw "Nie znaleziono piosenki o podanym ID.";
      }
    } else {
      setLoading(false);
      addError("Użytkownik nie istnieje lub nie ma piosenek.");
      // eslint-disable-next-line
      throw "Użytkownik nie istnieje lub nie ma piosenek.";
    }
  };

  const getCategoriesDb = async (): Promise<void> => {
    const categories = await getListDb('categories');
     setCategoriesDb(categories);
   };

  const addCategoryDb = async (category: Category) => {
   await addElementToDb(category, "categories");
    setCategoriesDb([...categoriesDb, category]);
  };

  const deleteCategoryDb = async (category: Category) => {
   await deleteElementDb(category, "categories");
   const updatedList = categoriesDb.filter(item => item.id !== category.id);
   setCategoriesDb([...updatedList]);
  };

  const getChoosenDb = async (): Promise<SongListRight[] | any[]> => {
    return getListDb('choosenSongs');
  };

  const addChoosenDb = async (
    song: SongListRight
  ): Promise<SongListRight[] | any[]> => {
    return addElementToDb({ ...song, id: song.id }, "choosenSongs");
  };

  const deleteChoosenDb = async (choosenSong: SongListRight) => {
    deleteElementDb(choosenSong, "choosenSongs");
  };

  const updateChoosenDb = async (song: SongListRight): Promise<void> => {
    await updateElementDb(song, "choosenSongs");
  };
  const updateChoosenListDb = async (songs: SongListRight[]): Promise<void> => {
    await updateListDb(songs, "choosenSongs");
  };

  const getSongListDb = async (): Promise<SongListLeft[]> => {
    return getListDb('songs');
  };

  const getSongDb = async (id: string) => {
    try {
      setLoading(true);
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .collection("songs")
        .doc(id);
      const userSnapshot = await userRef.get();
      if (userSnapshot.exists) {
        const text = userSnapshot.data();
        setLoading(false);
        return text;
      } else {
        setLoading(false);
        console.log("Nie znaleziono użytkownika.");
      }
    } catch (error) {
      setLoading(false);
      addError(error);
    }
  };

  const addSongDb = async (song: SongToAddLeft): Promise<string> => {
    try {
      const songToAdd = {
        category: song.category,
        title: song.title,
        semitones: 0
      };
  
      const el = await addElementToDb(songToAdd, "songs");
      const id: string = el.id;
      
      addSongTextToUser({ ...songToAdd, text: song.text, link: song.link, id });
      
      return id;
    } catch (error) {
      console.error("Błąd podczas dodawania piosenki dla użytkownika:", error);
      addError(error);
      throw error;
    }
  };

  const addSongTextToUser = async (song: SongListLeft): Promise<string> => {
    try {
      setLoading(true);
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .collection("songs")
        .doc(song.id);

      await userRef.set({
        text: song.text,
        title: song.title,
        category: song.category,
        link: song?.link
      });
      setLoading(false);
      return song.id;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const deleteSongDb = async (song: SongListLeft) => {
    try {
      await deleteElementDb(song, "songs");
      await deleteSongTextFromUser(song.id);
    } catch (error) {
      addError(error);
    }
  };
  const deleteSongTextFromUser = async (docId: string) => {
    if (user) {
      setLoading(true);
      try {
        const userSongRef = firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .collection("songs")
          .doc(docId);
        await userSongRef.delete();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        addError(error);
      }
    }
  };

  const updateSongDb = async (song: SongListRight, semitones: number) => {
    await updateSemitones(song, semitones);
    await updateSongTextForUser(song);
  };

 const updateSemitones = async (song: SongListRight, semitones: number) => {
    const songToAdd = {
      category: song.category,
      title: song.title,
      id: song.id,
      semitones: semitones
    };
    await updateElementDb(songToAdd, "songs");
  }

  const updateSongTextForUser = async (song: SongListRight) => {
    try {
      setLoading(true);
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .collection("songs")
        .doc(song.id);

      await userRef.update({
        ...song,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      addError(error);
    }
  };

  return (
    <SongsDbContext.Provider
      value={{
        categoriesDb,
        createUserDocument,
        getChoosenDb,
        addChoosenDb,
        deleteChoosenDb,
        updateChoosenDb,
        deleteCategoryDb,
        addCategoryDb,
        getCategoriesDb,
        addSongDb,
        deleteSongDb,
        updateSongDb,
        getSongListDb,
        getSongDb,
        updateSemitones,
        updateChoosenListDb,
        loading
      }}
    >
      {children}
    </SongsDbContext.Provider>
  );
};

export const useSongsDbContext = () => useContext(SongsDbContext);
