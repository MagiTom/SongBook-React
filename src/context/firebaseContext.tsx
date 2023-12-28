import React, { useContext, useState } from "react";
import { SongItem, SongListItem, SongPageItem, SongToAdd } from "../constans/songList";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";



export interface SongsDbModel {
  songListDb: SongListItem[] | undefined,
  addSongDb: (song: SongToAdd) => Promise<void>,
  getSongDb: (id: string, title: string) => Promise<SongListItem | any>,
  deleteSongDb: (docId: string, textId: string, title: string) => Promise<void>,
  updateSongDb: (id: string, updatedSong: SongItem) => Promise<void>,
  getSongListDb: () => Promise<SongListItem[] | any[]>,
}

const SongsDbContext = React.createContext<SongsDbModel>({
  songListDb: [],
  addSongDb: () => Promise.resolve(),
  getSongDb: () => Promise.resolve(null),
  deleteSongDb: () => Promise.resolve(),
  updateSongDb: () => Promise.resolve(),
  getSongListDb: () => Promise.resolve([]),
});

export const SongsDbProvider: React.FC<any> = ({ children }) => {
  const [songListDb, setSongListDb] = useState<SongListItem[] | undefined>();
  const [songDb, setSongDb] = useState<SongPageItem[] | undefined>();
  const collectionRef = collection(db, 'songs');

  const getSongDb = async (id: string, title: string) =>{
    // const id = 'ZEL8bu0JyDntRZGJG4qk'
    // const title = 'test2'
    const docRef = doc(db, "songs", id);
const docSnap = getDoc(docRef);
const songRef = collection(db, `songs/${docRef.id}/${title}`);
console.log("questionRef", songRef);
return getDocs(songRef).then(async (todo) => {
  let data = todo.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  const songToDb: SongItem | any = {
    ...(await docSnap).data(),
    ...data[0]
  }
  console.log('songToDb=>', songToDb);
  setSongDb(songToDb)
  return songToDb;

if ((await docSnap).exists()) {
  console.log("Document data:", (await docSnap).data());
} else {
  console.log("No such document!");
}
  })
  }

  const addSongDb = async (song: SongToAdd) => {
    const songToAdd = {
      category: song.category,
      title: song.title,
    };
    try {
      console.log(song);
      const title = 'test5'
      addDoc(collectionRef, songToAdd).then((res: any) => {
        console.log('respon', res.id);
        const questionRef = collection(db, `songs/${res.id}/${songToAdd.title}`);
        addDoc(questionRef, {text: song.text})
      })
      // Create a new document in sub-collection `general`
      // refetch songs after creating data
    } catch (err: unknown) {
      if (err instanceof Error) {
        // setError(err.message); // You can use this to handle errors if needed.
      } else {
        // setError('Something went wrong');
      }
    }
  };

  const deleteSongDb = async (docId: string, textId: string, title: string) => {
    try {
         window.confirm("Are you sure you want to delete this Todo?")
         const documentRef = doc(db, "songs", docId);
         const questionRef = collection(db, `songs/${docId}/${title}`);
         const documentRef2 = doc(questionRef, textId);
         await deleteDoc(documentRef2)
         await deleteDoc(documentRef)
         window.location.reload();
         } catch (err) {
         console.log(err);
       }
  };

  const updateSongDb = async (id: string, updatedSong: SongItem) => {
    try {
    } catch (err: unknown) {
      // Handle errors if needed.
    }
  };

  const getSongListDb = async (): Promise<SongListItem[] | any[]> => {
    return getDocs(collectionRef).then((todo) => {
        console.log(todo.docs);
        let data: SongListItem[] | any[] = todo.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        console.log('getSongListDb', data);
        setSongListDb(data);
        return data;
        }).catch((err) => {
          console.log(err);
          return []
        })
  };

  // Call handleInitDB() to initialize the database when this component mounts

  return (
    <SongsDbContext.Provider
      value={{ songListDb, addSongDb, deleteSongDb, updateSongDb, getSongListDb, getSongDb }}
    >
      {children}
    </SongsDbContext.Provider>
  );
};

export const useSongsDbContext = () => useContext(SongsDbContext);