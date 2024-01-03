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

export interface User {
  email: string;
}

export interface SongsDbModel {
  songListDb: SongListItem[] | undefined;
  categoriesDb: Category[];
  addSongDb: (song: SongToAdd) => Promise<void>;
  getSongDb: (id: string) => Promise<SongListItem | any>;
  deleteSongDb: (docId: string, textId: string) => Promise<void>;
  updateSongDb: (docId: string, song: SongPageItem) => Promise<void>;
  getSongListDb: () => Promise<SongListItem[]>;
  getChoosenDb: () => Promise<SongPageItem[]>;
  addChoosenDb: (song: SongPageItem) => Promise<SongPageItem[] | any[]>;
  deleteChoosenDb: (id: string) => Promise<void>;
  updateChoosenDb: (docId: string, song: SongPageItem) => Promise<void>;
  getCategoriesDb: () => Promise<void>;
  addCategoryDb: (category: Category) => Promise<void>;
  deleteCategoryDb: (id: string) => Promise<void>;
  createUserDocument: (user: any) => Promise<void>;
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

  const getCategoriesDb = async (): Promise<void> => {
    const userAuth = firebase.auth().currentUser;
    if (userAuth) {
      const userRef = db.collection("users").doc(userAuth.uid);
      try {
        const doc = await userRef.get();

        if (doc.exists) {
          const userData = doc.data();
          const categories = userData?.categories || [];

          console.log("Lista kategorii dla użytkownika:", categories);
          setCategoriesDb(categories);
          return categories;
        } else {
          console.log("Dokument użytkownika nie istnieje.");
          // return [];
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        addError(error);
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        // return [];
      }
    }
  };

  const addCategoryDb = async (category: Category) => {
    if (user) {
      const userRef = db.collection("users").doc(user.uid);
      const doc = await userRef.get();
      const newId = userRef.collection("categories").doc().id;
      if (doc.exists) {
        const userData = doc.data();
        let categories = userData?.categories || [];
        categories.push({ ...category, id: newId });
        await userRef.update({
          categories: categories,
        });
      }
    }
  };

  const deleteCategoryDb = async (id: string) => {
    try {
      const userRef = firebase.firestore().collection("users").doc(user?.uid);
      const userSnapshot = await userRef.get();
      if (userSnapshot.exists && userSnapshot.data()?.categories) {
        const categories = userSnapshot.data()?.categories;
        const updatedCategories = categories.filter(
          (category: Category) => category.id !== id
        );
        await userRef.update({ categories: updatedCategories });
      } else {
        addError(
          "Nie znaleziono użytkownika lub użytkownik nie posiada pól categories."
        );
      }
    } catch (error) {
      console.error("Błąd podczas usuwania piosenki dla użytkownika:", error);
      addError(error);
    }
  };

  // TO DO:

  const getChoosenDb = async (): Promise<SongPageItem[] | any[]> => {
    return getDocs(collectionChoosenRef)
      .then((song) => {
        let data: SongPageItem[] | any[] = song.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // setCategoriesDb(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
        addError(err?.message);
        return err;
      });
  };

  // TO DO

  const addChoosenDb = async (
    song: SongPageItem
  ): Promise<SongPageItem[] | any[]> => {
    return addDoc(collectionChoosenRef, {
      ...song,
    })
      .then((song) => {
        // setCategoriesDb(data);
        return song.id;
      })
      .catch((err) => {
        addError(err?.message);
        return err;
      });
  };

  // TO DO

  const deleteChoosenDb = async (id: string) => {
    const documentRef = doc(db, "choosenSongs", id);
    return deleteDoc(documentRef)
      .then((res) => console.log("resss", res))
      .catch((err) => addError(err?.message));
    // setCategoriesDb(categoriesDb.filter((item) => item.id !== id));
  };

  //TO DO

  const updateChoosenDb = async (
    docId: string,
    song: SongPageItem
  ): Promise<void> => {
    try {
      const songToAdd = {
        ...song,
      };
      const documentRef = doc(db, "choosenSongs", docId);
      updateDoc(documentRef, songToAdd);
    } catch (err: any) {
      addError(err?.message);
    }
  };

  const getSongDb = async (id: string) => {
    try {
      const userRef = firebase.firestore().collection('users').doc(user?.uid).collection('songs').doc(id);
      const userSnapshot = await userRef.get();

      if (userSnapshot.exists) {
        const text = userSnapshot.data();
        console.log("Pełny tekst piosenki:", text);
        return text
      } else {
        console.log("Nie znaleziono użytkownika.");
      }
    } catch (error) {
      console.error("Błąd podczas pobierania tekstu piosenki:", error);
      addError(error);
    }
  };

  const addSongDb = async (song: SongToAdd) => {
    if (user) {
      try {
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        const newId = userRef.collection("songs").doc().id
        const songToAdd = {
          category: song.category,
          title: song.title,
          id: newId,
        };
        await userRef.update({
          songs: firebase.firestore.FieldValue.arrayUnion(songToAdd),
        });
        addSongTextToUser({...songToAdd, text: song.text})

        console.log(
          "Piosenka została dodana dla użytkownika z pełnym tekstem."
        );
      } catch (error) {
        console.error(
          "Błąd podczas dodawania piosenki dla użytkownika:",
          error
        );
        addError(error);
      }
    }
  };

  const addSongTextToUser = async (song: SongToAddWithText) => {
    try {
      const userRef = firebase.firestore().collection('users').doc(user?.uid).collection('songs').doc(song.id);
  
      await userRef.set({
        text: song.text,
      });
  
      console.log('Pełny tekst piosenki został dodany dla użytkownika.');
    } catch (error) {
      console.error('Błąd podczas dodawania pełnego tekstu piosenki dla użytkownika:', error);
    }
  };
  
  // TO DO

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

  // TO DO

  const updateSongDb = async (docId: string, song: SongPageItem) => {
    // try {
    //   const songToAdd = {
    //     category: song.category,
    //     title: song.title,
    //     added: song?.added,
    //     text: song?.text,
    //     semitones: song?.semitones,
    //   };
    //   const documentRef = doc(db, "songs", docId);
    //   const questionRef = collection(db, `songs/${docId}/${docId}`);
    //   const documentRef2 = doc(questionRef, song.id);
    //   await updateDoc(documentRef, songToAdd);
    //   await updateDoc(documentRef2, { text: song.text, title: song.title });
    //   setSongListDb([...(songListDb || []), { ...songToAdd, id: docId }]);
    // } catch (err: any) {
    //   addError(err?.message);
    // }
    try {
      const songToAdd = {
        category: song.category,
        title: song.title,
        added: song?.added,
        text: song?.text,
        // semitones: song?.semitones,
      };
      const fullSongsRef = firebase
        .firestore()
        .collection("fullSongs")
        .doc(song.id);

      // Zaktualizowanie całej piosenki (id, tytuł i tekst)
      await fullSongsRef.set(songToAdd);

      console.log("Piosenka została zaktualizowana z pełnym tekstem.");
    } catch (error) {
      console.error("Błąd podczas aktualizacji piosenki:", error);
    }
  };

  const getSongListDb = async (): Promise<SongListItem[]> => {
    const userAuth = firebase.auth().currentUser;
    try {
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(userAuth?.uid);
      const userSnapshot = await userRef.get();

      if (userSnapshot.exists) {
        const songs = userSnapshot.data()?.songs;
        console.log("Lista piosenek użytkownika:", songs);
        setSongListDb(songs);
        return songs;
      } else {
        console.log("Nie znaleziono użytkownika.");
        addError("Nie znaleziono użytkownika.");
        return [];
      }
    } catch (error) {
      console.error("Błąd podczas pobierania listy piosenek:", error);
      addError(error);
      return [];
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
