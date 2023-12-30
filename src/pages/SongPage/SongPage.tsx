import { useNavigate, useParams } from "react-router-dom";
import {
  TransposeProvider,
  useTransposeContext,
} from "../../context/TransposeContext";
import { TransposeControl } from "../../components/TranponseControl/TransposeControl";
import "./style.scss";
import { useEffect, useState } from "react";
import { SongItem, SongList, SongPageItem } from "../../constans/songList";
import { useIndexedDB } from "react-indexed-db-hook";
import { SongView } from "../../components/SongView/SongView";
import { useSongsDbContext } from "../../context/firebaseContext";
import { Button, IconButton } from "@mui/material";
import { useSongListContext } from "../../context/SongListContext";
import AddSongDialog from "../../components/AddSongDialog/AddSongDialog";
import AlertDialog from "../../components/AlertDialog/AlertDialog";

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

  useEffect(() => {
    if (songListDb) {
      const findedSong = songListDb?.find((song) => song.id.toString() === id);
      console.log("idd", id);
      console.log("findedSong", findedSong);
      console.log("songItemList", songItemList);
      if (findedSong) {
        getSongDb(findedSong.id).then((song) => {
          setSong(song);
          getByID(findedSong?.id).then((fromDb) => {
            console.log("fromDb", fromDb);
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
    //usunac tez z indexed db
    // const checkIfInIndexesDb = songItemList.find((item: SongItem) => item.id === id);
    // console.log('checkIfInIndexesDb', checkIfInIndexesDb)
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
      <div className="song__actions">
        <AlertDialog
          confirmAction={handleRemove}
          button={
            <IconButton aria-label="delete">
              <Button variant="contained" color="error">
                Delete
              </Button>
            </IconButton>
          }
        ></AlertDialog>
        <AddSongDialog song={song} id={id}></AddSongDialog>
      </div>
    </div>
  );
};

export default SongPage;
