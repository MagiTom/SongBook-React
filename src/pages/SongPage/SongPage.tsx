import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddSongDialog from "../../components/AddSongDialog/AddSongDialog";
import AlertDialog from "../../components/AlertDialog/AlertDialog";
import { SongView } from "../../components/SongView/SongView";
import { useSongListContext } from "../../context/SongListContext";
import { useTransposeContext } from "../../context/TransposeContext";
import { auth } from "../../firebase-config";
import "./style.scss";
import { useSongsDbContext } from "../../context/firebaseContext";
import { SongListLeft, SongTextItem } from "../../models/SongListLeft.model";
import { SongListRight } from "../../models/SongListRight.model";

export const SongPage = () => {
  const { id } = useParams();
  const { getSongDb } = useSongsDbContext();
  const [songDB, setSongDB] = useState<SongListLeft>();
  const [song, setSong] = useState<SongListRight>();
  const {
    songListLeft,
    removeSong
  } = useSongListContext();
  const { setValue } = useTransposeContext();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    // setSelectedIndex(id);
      const songItem = songListLeft?.find((song: SongListLeft) => song?.id === id);
   
        getSongDb(id || '').then((songEl: SongTextItem) => {
          console.log('songEl', songEl)
          const fullSong: SongListRight = {...songEl, id: id || ''};
          // setSong(fullSong);
          setSongDB(songItem);
          setValue(+songItem?.semitones);
          let songToShow = fullSong;
          if(!songEl?.text) {
            songToShow = songListLeft?.find((song: SongListLeft) => song?.id === id);
          }
          setSong(songToShow);
          console.log('songToShow', songToShow)
        });
        // setValue(0);
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, songListLeft]);

  const handleRemove = async () => {
    console.log('song', song)
    if(id && song)
   await removeSong(song, songDB?.semitones);
    navigate("/");
  };

  return (
    <div className="song">
      {song && <SongView id={id || ""} song={song}></SongView>}
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
          <AddSongDialog song={song} semitones={songDB?.semitones || 0}></AddSongDialog>
        </div>
      )}
    </div>
  );
};

export default SongPage;
