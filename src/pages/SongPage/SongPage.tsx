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
import { FullSong } from "../../models/SongListLeft.model";

export const SongPage = () => {
  const { id } = useParams();
  const { songListDb, getSongDb, deleteSongDb } = useSongsDbContext();
  const [songDB, setSongDB] = useState<SongItem>();
  const [song, setSong] = useState<FullSong>();
  const { getByID } = useIndexedDB("songs");
  const {
    deleteSongFromList,
    songItemList,
    deleteFromAllList,
    setSelectedIndex,
    allSongList
  } = useSongListContext();
  const { setValue } = useTransposeContext();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    setSelectedIndex(id);
    console.log('song', id)
      const song = songItemList?.find((song: SongPageItem) => song?.id === id);
      if (song) {
        setSong(song);
        setSongDB(song);
        setValue(+song?.semitones);
      } else {
        getSongDb(id || '').then((songEl: FullSong) => {
          console.log('song', songEl)
          let songToShow = songEl;
          if(!songEl) {
            songToShow = allSongList?.find((song: SongPageItem) => song?.id === id);
          }
          setSong(songToShow);
        });
        setValue(0);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, songItemList]);

  const handleRemove = async () => {
    console.log('song', song)
    if(id && song)
   await deleteSongDb({...song, id});
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
          <AddSongDialog song={song}></AddSongDialog>
        </div>
      )}
    </div>
  );
};

export default SongPage;
