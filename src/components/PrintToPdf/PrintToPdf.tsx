import { Button } from "@mui/material";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { SongPageItem } from "../../constans/songList";
import { SongView } from "../SongView/SongView";
import "./style.scss";

const PrintToPdf: React.FC<{ songs: SongPageItem[] }> = ({ songs }) => {
  const componentRef = useRef(null);
  const contentToPrint = songs.map((song) => (
    <SongView
      inDb={true}
      key={song.id}
      song={song}
      id={song.id}
      isPrintMode={true}
    />
  ));

  return (
    <div className="printBtn">
      <ReactToPrint
      documentTitle="Śpiewnik"
        trigger={() => (
          <Button disabled={!songs?.length} variant="contained">
            Wydrukuj
          </Button>
        )}
        content={() => componentRef.current}
      />
      <div style={{ overflow: "hidden", height: "0" }}>
        <div style={{ color: 'black' }} ref={componentRef}>{contentToPrint}</div>
      </div>
    </div>
  );
};

export default PrintToPdf;
