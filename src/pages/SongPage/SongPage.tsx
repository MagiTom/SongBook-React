import { useNavigate, useParams } from "react-router-dom";
import {
  TransposeProvider,
  useTransposeContext,
} from "../../context/TransposeContext";
import { TransposeControl } from "../../components/TranponseControl/TransposeControl";
import "./style.scss";
import { useEffect, useRef, useState } from "react";
import { SongItem, SongList, SongPageItem } from "../../constans/songList";
import { useIndexedDB } from "react-indexed-db-hook";
import { SongView } from "../../components/SongView/SongView";
import { useSongsDbContext } from "../../context/firebaseContext";
import { Button, IconButton } from "@mui/material";
import { useSongListContext } from "../../context/SongListContext";
import AddSongDialog from "../../components/AddSongDialog/AddSongDialog";
import AlertDialog from "../../components/AlertDialog/AlertDialog";
import { auth } from "../../firebase-config";

export const SongPage = () => {
  const { id } = useParams();
  const { songListDb, getSongDb, deleteSongDb } = useSongsDbContext();
  const [songDB, setSongDB] = useState<SongItem>();
  const [song, setSong] = useState<SongPageItem>();
  const { update, getByID } = useIndexedDB("songs");
  const { deleteSongFromList, songItemList, deleteFromAllList } =
    useSongListContext();
  const { semitones, setValue } = useTransposeContext();
  const navigate = useNavigate();
  const user = auth.currentUser;


  useEffect(() => {
    if (songListDb) {
      const findedSong = songListDb?.find((song) => song.id.toString() === id);
      if (findedSong) {
        getSongDb(findedSong.id).then((song) => {
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
  }, [id, songItemList]);

  const updateSongList = (ev: number) => {
    if (songDB) {
      update({ ...songDB, semitones: `${ev}` });
    }
  };

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
    {user &&  <div className="song__actions">
        <AlertDialog
          confirmAction={handleRemove}
          button={
              <Button variant="outlined" color="error">
                Usuń
              </Button>
          }
        ></AlertDialog>
        <AddSongDialog song={song} id={id}></AddSongDialog>
      </div>} 
    </div>
  );
};

export default SongPage;
