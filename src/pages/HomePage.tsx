import React, { useEffect, useState } from "react";
import CategoryButton from "../components/CategoryButton/CategoryButton";
import { categories } from "../constans/categories";
import "./style.scss";
import { SongItem, SongList } from "../constans/songList";
import SongTitle from "../components/SongTitle/SongTitle";
import { useSongListContext } from "../context/SongListContext";

export const HomePage = () => {
  const categoriesList = categories;
  const songList: SongItem[] = SongList;
  const [choosenList, setChoosenList] = useState<SongItem[]>([]);
  const [songListItems, setSongListItems] = useState<SongItem[]>([]);
  const { addSong, songItemList } = useSongListContext();
  
  useEffect(() => {
    const updatedChoosenList = songList.map((song) => {
      const isAdded = songItemList.some((item: SongItem) => item.id === song.id);
      return {
        ...song,
        added: isAdded,
      };
    });
    setSongListItems(updatedChoosenList);
    setChoosenList(updatedChoosenList);
  }, [songItemList, songList]);

  const addSongItem = (song: SongItem) =>{
    addSong(song);
      setChoosenList((prevList) =>
    prevList.map((prevSong) =>
      prevSong.id === song.id ? { ...prevSong, added: true } : prevSong
    )
  );
  }

  const filterByCategory = (category: string) =>{
      const updatedChoosenList = songListItems.filter(song => song.category === category);
      setChoosenList(updatedChoosenList);
  }

  return (
    <div className="home">
      <div className="categories">
        {categoriesList.map((category) => (
          <CategoryButton
            key={category.id} 
            category={category}
            getCategory={() => filterByCategory(category.key)} 
          />
        ))}
      </div>
      <div className="songs">
          {choosenList?.map(song => <SongTitle key={song.id} addSongToList={addSongItem} song={song} added={song.added || false} />)}
      </div>
    </div>
  );
};

export default HomePage;
