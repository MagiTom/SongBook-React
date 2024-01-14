import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SongTitle from "../../components/SongTitle/SongTitle";
import { useSongListContext } from "../../context/SongListContext";
import { SongListLeft } from "../../models/SongListLeft.model";
import "./style.scss";

export const CategoryPage: React.FC<any> = () => {
  const { category } = useParams();
  const [songListItems, setSongListItems] = useState<SongListLeft[]>([]);
  const { addSongRight, songListLeft } = useSongListContext();
  const navigate = useNavigate();

  useEffect(() => {
    const findSongByCategory = songListLeft.filter(
      (song: SongListLeft) => song.category === category
    );
    setSongListItems(category ? findSongByCategory : songListLeft);
  }, [category, songListLeft]);

  const addSongItem = async (song: SongListLeft) => {
    addSongRight(song);
  };

  const goPage = (id: string) => {
    const url = `/song/${id}`;
    navigate(url);
  };

  return (
    <div className="list">
      {songListItems?.map((song) => (
        <SongTitle
          goToPage={() => goPage(song.id)}
          key={song.id}
          addSongToList={addSongItem}
          song={song}
        />
      ))}
    </div>
  );
};
