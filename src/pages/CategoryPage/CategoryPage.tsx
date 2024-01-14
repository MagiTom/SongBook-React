import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SongTitle from "../../components/SongTitle/SongTitle";
import { useSongListContext } from "../../context/SongListContext";
import { SongListLeft } from "../../models/SongListLeft.model";
import "./style.scss";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const CategoryPage: React.FC<any> = () => {
  const { category } = useParams();
  const [songListItems, setSongListItems] = useState<SongListLeft[]>([]);
  const [songListItemsCopy, setSongListItemsCopy] = useState<SongListLeft[]>([]);
  const { addSongRight, songListLeft } = useSongListContext();
  const navigate = useNavigate();

  useEffect(() => {
    const findSongByCategory = songListLeft.filter(
      (song: SongListLeft) => song.category === category
    );
    const list = category ? findSongByCategory : songListLeft;
    setSongListItems(list);
    setSongListItemsCopy(list);
  }, [category, songListLeft]);

  const addSongItem = async (song: SongListLeft) => {
    addSongRight(song);
  };

  const goPage = (id: string) => {
    const url = `/song/${id}`;
    navigate(url);
  };

  function setFilter(value: string): void {
    const filteredData = [...songListItemsCopy].filter((obj) =>
      obj.title.includes(value)
    );
    setSongListItems(filteredData);
  }

  return (
    <div className="category-page">
      <TextField
        color="success"
        autoFocus
        margin="dense"
        label="szukaj"
        fullWidth
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={(e) => setFilter(e.target.value)}
      />
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
    </div>
  );
};
