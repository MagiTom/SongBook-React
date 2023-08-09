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
  const { addSong, songItemList } = useSongListContext();
  
  useEffect(function () {
   setChoosenList(songList);
  }, []);

  const addSongItem = () =>{

  }

  return (
    <div className="home">
      <div className="categories">
        {categoriesList.map((category) => (
          <CategoryButton
            key={category.id} 
            category={category}
            getCategory={() => console.log("jajajja")} 
          />
        ))}
      </div>
      <div className="songs">
          {choosenList?.map(song => <SongTitle key={song.id} addSongToList={addSongItem} song={song} added={false} />)}
      </div>
    </div>
  );
};

export default HomePage;
