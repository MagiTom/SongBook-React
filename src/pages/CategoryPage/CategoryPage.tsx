import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SongTitle from "../../components/SongTitle/SongTitle";
import { categories } from "../../constans/categories";
import { SongItem, SongList } from "../../constans/songList";
import { useSongListContext } from "../../context/SongListContext";


export const CategoryPage = () => {
    const { category } = useParams();
    const [songListItems, setSongListItems] = useState<SongItem[]>([]);
    const { addSong, allSongList } = useSongListContext();
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log(category)
      const findSongByCategory = allSongList.filter((song: SongItem) => song.category === category);
      const chooseList = findSongByCategory.length ? findSongByCategory : allSongList;
      setSongListItems(chooseList);
    }, [category, allSongList]);
  
    const addSongItem = async (song: SongItem) =>{
      await addSong(song);
    }
  
    const goPage = (url: string) =>{
        navigate(url);
    }
  

    return (
<>
{songListItems?.map(song => <SongTitle goToPage={()=> goPage(`/song/${song.id}`)} key={song.id} addSongToList={addSongItem} song={song} />)}
</>
    )
}
