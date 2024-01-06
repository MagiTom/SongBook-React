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
  SongToAddWithText,
} from "../constans/songList";
import { db } from "../firebase-config";
import { useErrorContext } from "./ErrorContext";
import firebase from "firebase/compat/app";
import {
  FullSong,
  SongListLeft,
  SongToUpdate,
} from "../models/SongListLeft.model";
import { SongListRight } from "../models/SongListRight.model";

export interface User {
  email: string;
}

export interface SongsDbModel {
  songListDb: SongListLeft[] | undefined;
  categoriesDb: Category[];
  addSongDb: (song: SongToAdd) => Promise<string>;
  getSongDb: (id: string) => Promise<SongListLeft | any>;
  deleteSongDb: (song: FullSong) => Promise<void>;
  updateSongDb: (song: SongToUpdate) => Promise<void>;
  getSongListDb: () => Promise<SongListItem[]>;
  getChoosenDb: () => Promise<SongListRight[]>;
  addChoosenDb: (song: SongPageItem) => Promise<SongListRight[] | any[]>;
  deleteChoosenDb: (choosenSong: SongListRight) => Promise<void>;
  updateChoosenDb: (song: SongListRight) => Promise<void>;
  getCategoriesDb: () => Promise<void>;
  addCategoryDb: (category: Category) => Promise<void>;
  deleteCategoryDb: (category: Category) => Promise<void>;
  createUserDocument: (user: any) => Promise<void>;
}

const SongsDbContext = React.createContext<SongsDbModel>({
  songListDb: [],
  categoriesDb: [],
  addSongDb: () => Promise.resolve(''),
  getSongDb: () => Promise.resolve(null),
  deleteSongDb: () => Promise.resolve(),
  updateSongDb: () => Promise.resolve(),
  getCategoriesDb: () => Promise.resolve(),
  addCategoryDb: () => Promise.resolve(),
  deleteCategoryDb: () => Promise.resolve(),
  getSongListDb: () => Promise.resolve([]),
  getChoosenDb: () => Promise.resolve([]),
  addChoosenDb: () => Promise.resolve([]),
  deleteChoosenDb: () => Promise.resolve(),
  updateChoosenDb: () => Promise.resolve(),
  createUserDocument: () => Promise.resolve(),
});

export const SongsDbProvider: React.FC<any> = ({ children }) => {
  const [songListDb, setSongListDb] = useState<SongListItem[] | undefined>();
  const [categoriesDb, setCategoriesDb] = useState<Category[]>([]);
  const collectionRef = collection(db, "songs");
  const collectionCategoryRef = collection(db, "categories");
  const collectionChoosenRef = collection(db, "choosenSongs");
  const { addError } = useErrorContext();
  const user = firebase.auth().currentUser;

  const createUserDocument = async (user: any) => {
    if (user) {
      const userRef = db.collection("users").doc(user.uid);
      const doc = await userRef.get();
      if (!doc.exists) {
        await userRef.set({
          email: user.email,
        });
      }
    }
  };

  const getListDb = async (collection: string): Promise<any> => {
    const userAuth = firebase.auth().currentUser;
    if (userAuth) {
      const userRef = db.collection("users").doc(userAuth.uid);
      try {
        const doc = await userRef.get();
        if (doc.exists) {
          const userData = doc.data();
          const listCol = userData?.[collection] || [];
          return listCol;
        } else {
          throw ('Dokument użytkownika nie istnieje.')
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        addError(error);
        throw error;
      }
    }
  }

  const addElementToDb = async (element: any, collection: string): Promise<any> => {
    try {
      const userRef = firebase.firestore().collection("users").doc(user?.uid);
      const newId = element?.id || userRef.collection(collection).doc().id;
      const updateEl = { ...element, id: newId };
      await userRef.update({
        [collection]: firebase.firestore.FieldValue.arrayUnion(updateEl),
      });
      return updateEl;
    } catch (error) {
      console.error("Błąd podczas dodawania piosenki dla użytkownika:", error);
      addError(error);
      throw error;
    }
  };

  const deleteElementDb = async (
    element: any,
    collection: string
  ): Promise<void> => {
    try {
      console.log("element", element);
      const userRef = firebase.firestore().collection("users").doc(user?.uid);
      await userRef.update({
        [collection]: firebase.firestore.FieldValue.arrayRemove(element),
      });
    } catch (error) {
      console.error("Błąd podczas usuwania piosenki:", error);
      addError(error);
      throw error;
    }
  };

  const updateElementDb = async (
    element: any,
    collection: string
  ): Promise<void> => {
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

        console.log("Piosenka zaktualizowana pomyślnie!");
      } else {
        console.log("Nie znaleziono piosenki o podanym ID.");
        addError("Nie znaleziono piosenki o podanym ID.");
        throw "Nie znaleziono piosenki o podanym ID.";
      }
    } else {
      console.log("Użytkownik nie istnieje lub nie ma piosenek.");
      addError("Użytkownik nie istnieje lub nie ma piosenek.");
      throw "Użytkownik nie istnieje lub nie ma piosenek.";
    }
  };

  const getCategoriesDb = async (): Promise<void> => {
    const categories = await getListDb('categories');
     setCategoriesDb(categories);
   };

  const addCategoryDb = async (category: Category) => {
    addElementToDb(category, "categories");
  };

  const deleteCategoryDb = async (category: Category) => {
    deleteElementDb(category, "categories");
  };

  const getChoosenDb = async (): Promise<SongListRight[] | any[]> => {
    return getListDb('choosenSongs');
  };

  const addChoosenDb = async (
    song: SongPageItem
  ): Promise<SongPageItem[] | any[]> => {
    return addElementToDb({ ...song, id: song.songId }, "choosenSongs");
  };

  const deleteChoosenDb = async (choosenSong: SongListRight) => {
    deleteElementDb(choosenSong, "choosenSongs");
  };

  const updateChoosenDb = async (song: SongPageItem): Promise<void> => {
    await updateElementDb(song, "choosenSongs");
  };

  const getSongListDb = async (): Promise<SongListLeft[]> => {
    return getListDb('songs');
  };

  const getSongDb = async (id: string) => {
    try {
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .collection("songs")
        .doc(id);
      const userSnapshot = await userRef.get();

      if (userSnapshot.exists) {
        const text = userSnapshot.data();
        console.log("Pełny tekst piosenki:", text);
        return text;
      } else {
        console.log("Nie znaleziono użytkownika.");
      }
    } catch (error) {
      console.error("Błąd podczas pobierania tekstu piosenki:", error);
      addError(error);
    }
  };

  const addSongDb = async (song: SongToAdd): Promise<string> => {
    try {
      const songToAdd = {
        category: song.category,
        title: song.title,
      };
  
      const el = await addElementToDb(songToAdd, "songs");
      const id: string = el.id;
      
      addSongTextToUser({ ...songToAdd, text: song.text, id });
      
      return id;
    } catch (error) {
      console.error("Błąd podczas dodawania piosenki dla użytkownika:", error);
      addError(error);
      throw error;
    }
  };

  const addSongTextToUser = async (song: SongToUpdate): Promise<string> => {
    try {
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
      });
      return song.id;

      console.log("Pełny tekst piosenki został dodany dla użytkownika.");
    } catch (error) {
      console.error(
        "Błąd podczas dodawania pełnego tekstu piosenki dla użytkownika:",
        error
      );
      throw error;
    }
  };

  const deleteSongDb = async (song: FullSong) => {
    try {
      const songToDelete = {
        id: song.id,
        category: song.category,
        title: song.title,
      };
      await deleteElementDb(songToDelete, "songs");
      await deleteSongTextFromUser(song.id);
    } catch (error) {
      console.error("Błąd podczas usuwania piosenki:", error);
      addError(error);
    }
  };
  const deleteSongTextFromUser = async (docId: string) => {
    if (user) {
      try {
        const userSongRef = firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .collection("songs")
          .doc(docId);

        await userSongRef.delete();

        console.log("Pełny tekst piosenki został pomyślnie usunięty.");
      } catch (error) {
        console.error(
          "Błąd podczas usuwania pełnego tekstu piosenki dla użytkownika:",
          error
        );
        addError(error);
      }
    }
  };

  const updateSongDb = async (song: SongToUpdate) => {
    const songToAdd = {
      category: song.category,
      title: song.title,
    };
    await updateElementDb(songToAdd, "songs");
    await updateSongTextForUser(song);
  };

  const updateSongTextForUser = async (song: SongToUpdate) => {
    try {
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .collection("songs")
        .doc(song.id);

      await userRef.update({
        ...song,
      });

      console.log("Tekst piosenki został zaktualizowany dla użytkownika.");
    } catch (error) {
      console.error(
        "Błąd podczas aktualizacji tekstu piosenki dla użytkownika:",
        error
      );
    }
  };

  return (
    <SongsDbContext.Provider
      value={{
        songListDb,
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
      }}
    >
      {children}
    </SongsDbContext.Provider>
  );
};

export const useSongsDbContext = () => useContext(SongsDbContext);
