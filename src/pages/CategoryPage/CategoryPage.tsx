import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SongTitle from "../../components/SongTitle/SongTitle";
import { SongItem } from "../../constans/songList";
import { useSongListContext } from "../../context/SongListContext";
import { auth } from "../../firebase-config";

export const CategoryPage = () => {
  const { category } = useParams();
  const [songListItems, setSongListItems] = useState<SongItem[]>([]);
  const { addSong, allSongList, addSongAdmin } = useSongListContext();
  const navigate = useNavigate();
  const user = auth.currentUser; 

  useEffect(() => {
    const findSongByCategory = allSongList.filter(
      (song: SongItem) => song.category === category
    );
    setSongListItems(category ? findSongByCategory : allSongList);
  }, [category, allSongList]);

  const addSongItem = async (song: SongItem) => {
    if(!user){
      await addSong(song);
    } else {
      await addSongAdmin(song)
    }
  
  };

  const goPage = (id: string) => {
    const url = `/song/${id}`;
    navigate(url);
  };

  return (
    <>
      {songListItems?.map((song) => (
        <SongTitle
          goToPage={() => goPage(song.id)}
          key={song.id}
          addSongToList={addSongItem}
          song={song}
        />
      ))}
    </>
  );
};
