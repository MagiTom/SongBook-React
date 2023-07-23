import { createContext, useState, useEffect, useContext } from 'react';

const SongListContext: React.Context<any> = createContext([]);

export const SonglistProvider: React.FC<any> = ({ children }) =>{

    return(
        <SongListContext.Provider  value={{ }}>
        {children}
        </SongListContext.Provider>
    )
}

export const useSongListContext = () => useContext(SongListContext);

