import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { useNavigate, useParams } from "react-router-dom";
import AddSongDialog from "../../components/AddSongDialog/AddSongDialog";
import AlertDialog from "../../components/AlertDialog/AlertDialog";
import { SongView } from "../../components/SongView/SongView";
import { SongItem, SongPageItem } from "../../constans/songList";
import { useSongListContext } from "../../context/SongListContext";
import { useTransposeContext } from "../../context/TransposeContext";
import { auth } from "../../firebase-config";
import "./style.scss";
import { useSongsDbContext } from "../../context/firebaseContext";

export const SongPage = () => {
  const { id } = useParams();
  const { songListDb, getSongDb, deleteSongDb } = useSongsDbContext();
  const [songDB, setSongDB] = useState<SongItem>();
  const [song, setSong] = useState<SongPageItem>();
  const { getByID } = useIndexedDB("songs");
  const {
    deleteSongFromList,
    songItemList,
    deleteFromAllList,
    setSelectedIndex,
  } = useSongListContext();
  const { setValue } = useTransposeContext();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    setSelectedIndex(id);
    if (!user && songListDb) {
      const findedSong = songListDb?.find((song) => song.id.toString() === id);
      if (findedSong) {
        getSongDb(findedSong.id).then((song: SongPageItem) => {
          setSong(song);
          getByID(findedSong?.id).then((fromDb) => {
            setSongDB(fromDb);
            if (fromDb) {
              setValue(+fromDb?.semitones);
            } else {
              setValue(0);
            }
          });
        });
      }
    } 
    
    if (user) {
      const song = songItemList?.find((song: SongPageItem) => song?.songId === id);
      if (song) {
        setSong(song);
        setSongDB(song);
        setValue(+song?.semitones);
      } else {
        getSongDb(id || '').then((song: SongPageItem) => {
          setSong(song);
        });
        setValue(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, songItemList]);

  const handleRemove = async () => {
    if (id && song) await deleteSongDb(id, song?.id);
    if (songDB) {
      deleteFromAllList(songDB.id);
    } else {
      await deleteSongFromList(id);
    }
    navigate("/");
  };

  return (
    <div className="song">
      {song && <SongView id={id || ""} song={song} inDb={!!songDB}></SongView>}
      {user && (
        <div className="song__actions">
          <AlertDialog
            confirmAction={handleRemove}
            button={
              <Button variant="outlined" color="error">
                Usuń
              </Button>
            }
          ></AlertDialog>
          <AddSongDialog song={song} id={id}></AddSongDialog>
        </div>
      )}
    </div>
  );
};

export default SongPage;
