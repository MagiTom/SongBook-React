import React, { useEffect, useState } from "react";
import CategoryButton from "../components/CategoryButton/CategoryButton";
import { categories } from "../constans/categories";
import "./style.scss";
import { SongItem, SongList } from "../constans/songList";
import SongTitle from "../components/SongTitle/SongTitle";
import { useSongListContext } from "../context/SongListContext";
import { Outlet, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase-config'


export const HomePage = () => {
  const categoriesList = categories;
  const collectionRef = collection(db, 'songs');

  const getData = async () => {
    const docRef = doc(db, "songs", 'ZEL8bu0JyDntRZGJG4qk');
const docSnap = getDoc(docRef);

if ((await docSnap).exists()) {
  console.log("Document data:", (await docSnap).data());
} else {
  console.log("No such document!");
}
  }

  const fetchData = async () => {
    const catRef = collection(db, "songs");
    const querySnapshot = await getDocs(catRef);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const questionRef = collection(db, `songs/${doc.id}/${doc.data().title}`);
      console.log("questionRef", questionRef);
      getDocs(questionRef).then((todo) => {
        console.log('ooo1=>', todo);
        let data = todo.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        console.log('ooo2=>', data[0]);
        }).catch((err) => {
          console.log(err);
        })
    });
  };
  

  useEffect(() => {

    const getTodo = async () => {
      await getDocs(collectionRef).then((todo) => {
        console.log(todo.docs);
        let data = todo.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        console.log(data);
        }).catch((err) => {
          console.log(err);
        })
      }
    getTodo()
    getData()
    fetchData()
    }, [])

  const navigate = useNavigate();
  const goToCategory = (category: string) =>{
    return navigate(`/${category}`);
  }

  const deleteTodo = async (id: string) => {
    try {
      const ide = 'SM7OEa4risyHhdQElkea'
      const title = 'test5';
      const textId = '93mH0SXbsuTae8d8ncQm'
       window.confirm("Are you sure you want to delete this Todo?")
       const documentRef = doc(db, "songs", ide);
       const questionRef = collection(db, `songs/${ide}/${title}`);
       const documentRef2 = doc(questionRef, textId);
       await deleteDoc(documentRef2)
       await deleteDoc(documentRef)
       window.location.reload();
       } catch (err) {
       console.log(err);
     }
   }

  const sending = () =>{
    const title = 'test5'
    addDoc(collectionRef, { title, text: 'lalal777alalla lalla', category: 'worship' }).then((res: any) => {
      console.log('respon', res.id);
      const questionRef = collection(db, `songs/${res.id}/${title}`);
      addDoc(questionRef, {text: 'udało sie'})
    })
    // Create a new document in sub-collection `general`

  }
  return (
    <div className="home">
      <div className="categories">
        {categoriesList.map((category) => (
          <CategoryButton
            key={category.id} 
            category={category}
            getCategory={() => goToCategory(category.key)} 
          />
        ))}
      </div>
      <div className="songs">
      <Outlet />
      </div>
      <div>
        <p>TEST</p>
        <textarea></textarea>
        <button onClick={sending}>send</button>
        <button onClick={() => deleteTodo('')}>delete</button>
      </div>
    </div>
  );
};

export default HomePage;
