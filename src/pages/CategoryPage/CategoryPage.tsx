import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SongTitle from "../../components/SongTitle/SongTitle";
import { SongItem } from "../../constans/songList";
import { useSongListContext } from "../../context/SongListContext";
import { auth } from "../../firebase-config";

export const CategoryPage = () => {
  const { category } = useParams();
  const [songListItems, setSongListItems] = useState<SongItem[]>([]);
  const {      updateSongLists,
    getSongListAdmin,
    addSongRight,
    removeSongRight,
    editSong,
    updateSongsRight,
    addSongListLeft,
    songListLeft,
    songListRight } = useSongListContext();
  const navigate = useNavigate();
  const user = auth.currentUser; 

  useEffect(() => {
    const findSongByCategory = songListLeft.filter(
      (song: SongItem) => song.category === category
    );
    setSongListItems(category ? findSongByCategory : songListLeft);
  }, [category, songListLeft]);

  const addSongItem = async (song: SongItem) => {
    addSongRight(song);
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
