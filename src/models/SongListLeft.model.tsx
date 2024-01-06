export interface SongListLeft {
    id: string;
    title: string;
    category: string;
    added?: boolean;
}

export interface FullSong extends SongListLeft{
text: string;
}

export interface SongToAdd {
    title: string,
    category: string,
    text: string,
}

export interface SongToUpdate extends SongToAdd{
    id: string;
}