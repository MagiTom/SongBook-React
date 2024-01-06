export interface SongListLeft {
    id: string;
    title: string;
    category: string;
}

export interface FullSong extends SongListLeft{
text: string;
}

export interface SongToAdd {
    title: string,
    category: string,
    text: string,
}