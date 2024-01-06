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
import { FullSong, SongListLeft } from "../models/SongListLeft.model";

export interface User {
  email: string;
}

export interface SongsDbModel {
  songListDb: SongListLeft[] | undefined;
  categoriesDb: Category[];
  addSongDb: (song: SongToAdd) => Promise<void>;
  getSongDb: (id: string) => Promise<SongListLeft | any>;
  deleteSongDb: (song: FullSong) => Promise<void>;
  updateSongDb: (docId: string, song: SongPageItem) => Promise<void>;
  getSongListDb: () => Promise<SongListItem[]>;
  getChoosenDb: () => Promise<SongPageItem[]>;
  addChoosenDb: (song: SongPageItem) => Promise<SongPageItem[] | any[]>;
  deleteChoosenDb: (id: string) => Promise<void>;
  updateChoosenDb: (song: SongPageItem) => Promise<void>;
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

  const addElementToDb = async (element: any, collection: string) =>{
    try {
      const userRef = firebase.firestore().collection("users").doc(user?.uid);
      const newId = element?.id || userRef.collection(collection).doc().id;
      const updateEl = {...element, newId};
      await userRef.update({
        [collection]: firebase.firestore.FieldValue.arrayUnion(updateEl),
      });
      console.log(
        "Piosenka została dodana dla użytkownika z pełnym tekstem."
      );

      return updateEl;
    } catch (error) {
      console.error(
        "Błąd podczas dodawania piosenki dla użytkownika:",
        error
      );
      addError(error);
    }
  }

  const addCategoryDb = async (category: Category) => {
      addElementToDb(category, "categories");
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

  const getChoosenDb = async (): Promise<SongPageItem[] | any[]> => {
    const userAuth = firebase.auth().currentUser;
      const userRef = db.collection("users").doc(userAuth?.uid);
      try {
        const doc = await userRef.get();
        if (doc.exists) {
          const userData = doc.data();
          const choosenSongs = userData?.choosenSongs || [];

          console.log("Lista dla użytkownika:", choosenSongs);
          return choosenSongs;
        } else {
          console.log("Dokument użytkownika nie istnieje.");
          return [];
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        addError(error);
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        return [];
      }
  };

  const addChoosenDb = async (
    song: SongPageItem
  ): Promise<SongPageItem[] | any[]> => {
      const userRef = db.collection("users").doc(user?.uid);
      const doc = await userRef.get();
      if (doc.exists) {
        const userData = doc.data();
        let choosenSongs = userData?.choosenSongs || [];
        choosenSongs.push({ ...song, id: song.songId });
        await userRef.update({
          choosenSongs: choosenSongs,
        });
        return choosenSongs;
      } else {
        return [];
      }
  };

  const deleteChoosenDb = async (id: string) => {
    try {
      const userRef = firebase.firestore().collection("users").doc(user?.uid);
      const userSnapshot = await userRef.get();
      if (userSnapshot.exists && userSnapshot.data()?.choosenSongs) {
        const choosenSongs = userSnapshot.data()?.choosenSongs;
        const updatedChoosenSongs = choosenSongs.filter(
          (choosenSong: SongPageItem) => choosenSong.id !== id
        );
        await userRef.update({ choosenSongs: updatedChoosenSongs });
      } else {
        addError(
          "Nie znaleziono użytkownika lub użytkownik nie posiada pól choosenSongs."
        );
      }
    } catch (error) {
      console.error("Błąd podczas usuwania piosenki dla użytkownika:", error);
      addError(error);
    }
  };

  const updateChoosenDb = async (
    song: SongPageItem
  ): Promise<void> => {
    const userRef = firebase.firestore().collection("users").doc(user?.uid);
    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      const userSongs = userSnapshot.data()?.choosenSongs;
      const songIndex = userSongs.findIndex(
        (item: SongListItem) => song.id === item.id
      );
      if (songIndex !== -1) {
        userSongs[songIndex] = {
          ...userSongs[songIndex],
          ...song,
        };
        await userRef.update({
          choosenSongs: userSongs,
        });
  };
}
  }

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

  const addSongDb = async (song: SongToAdd) => {
    if (user) {
      try {
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        const newId = userRef.collection("songs").doc().id;
        const songToAdd = {
          category: song.category,
          title: song.title,
          id: newId,
        };
        await userRef.update({
          songs: firebase.firestore.FieldValue.arrayUnion(songToAdd),
        });
        addSongTextToUser({ ...songToAdd, text: song.text });

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
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .collection("songs")
        .doc(song.id);

      await userRef.set({
        text: song.text,
        title: song.title,
        category: song.category
      });

      console.log("Pełny tekst piosenki został dodany dla użytkownika.");
    } catch (error) {
      console.error(
        "Błąd podczas dodawania pełnego tekstu piosenki dla użytkownika:",
        error
      );
    }
  };

  const deleteSongDb = async (song: FullSong) => {
    console.log('songToDelete', song)
    if (user) {
      try {
      const songToDelete = {
        id: song.id,
        category: song.category,
        title: song.title
      }
      console.log('songToDelete', songToDelete)
      const userRef = firebase.firestore().collection("users").doc(user.uid);
      await userRef.update({
        songs: firebase.firestore.FieldValue.arrayRemove(songToDelete),
      });
      console.log("Piosenka została pomyślnie usunięta.");
      // Przyjmując, że deleteSongTextFromUser jest zdefiniowane gdzieś indziej
      deleteSongTextFromUser(song.id);
      } catch (error) {
        console.error("Błąd podczas usuwania piosenki:", error);
        addError(error);
      }
  }
}
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


  const updateSongDb = async (docId: string, song: SongPageItem) => {
    const userRef = firebase.firestore().collection("users").doc(user?.uid);
    const songToAdd = {
      category: song.category,
      title: song.title,
    };

    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      const userSongs = userSnapshot.data()?.songs;
      const songIndex = userSongs.findIndex(
        (song: SongListItem) => song.id === docId
      );
      if (songIndex !== -1) {
        userSongs[songIndex] = {
          ...userSongs[songIndex],
          ...songToAdd,
        };
        await userRef.update({
          songs: userSongs,
        });
        updateSongTextForUser(userSongs[songIndex].id, {...songToAdd, text: song.text});

        console.log("Piosenka zaktualizowana pomyślnie!");
      } else {
        console.log("Nie znaleziono piosenki o podanym ID.");
        addError("Nie znaleziono piosenki o podanym ID.");
      }
    } else {
      console.log("Użytkownik nie istnieje lub nie ma piosenek.");
      addError("Użytkownik nie istnieje lub nie ma piosenek.");
    }
  };

  const updateSongTextForUser = async (id: string, songToAdd: SongToAdd) => {
    try {
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .collection("songs")
        .doc(id);
  
      await userRef.update({
        ...songToAdd
      });
  
      console.log("Tekst piosenki został zaktualizowany dla użytkownika.");
    } catch (error) {
      console.error("Błąd podczas aktualizacji tekstu piosenki dla użytkownika:", error);
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
