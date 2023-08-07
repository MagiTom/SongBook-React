import React, { useRef } from "react";
import { SongItem } from "../../constans/songList";
import ReactToPrint from 'react-to-print';
import { SongView } from "../SongView/SongView";
import { Button } from "@mui/material";
import "./style.scss";

const PrintToPdf: React.FC<{ songs: SongItem[] }> = ({ songs }) => {
    const componentRef = useRef(null);

    const contentToPrint = songs.map(song => (
        <SongView key={song.id} song={song} isPrintMode={true} />
    ));

    return (
        <div className="printBtn">
            <ReactToPrint
                trigger={() => <Button disabled={!songs?.length} variant="contained">Wydrukuj</Button>}
                content={() => componentRef.current}
            />
            <div style={{overflow: 'hidden', height: '0'}}>
            <div ref={componentRef}>
                {contentToPrint}
            </div>
        </div>
        </div>
    );
};

export default PrintToPdf;
