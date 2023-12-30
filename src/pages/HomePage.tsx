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
import { useSongsDbContext } from "../context/firebaseContext";


export const HomePage = () => {
  const categoriesList = categories;
  const collectionRef = collection(db, 'songs');
  const { getCategoriesDb } = useSongsDbContext();
  const { categoriesDb, deleteCategoryDb, addCategoryDb } = useSongsDbContext();

  const navigate = useNavigate();
  const goToCategory = (category: string) =>{
    return navigate(`/${category}`);
  }

  return (
    <div className="home">
      <div className="categories">
        {categoriesDb.map((category) => (
          <CategoryButton
            key={category.id} 
            category={category}
            getCategory={() => goToCategory(category.name)} 
          />
        ))}
      </div>
      <div className="songs">
      <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
