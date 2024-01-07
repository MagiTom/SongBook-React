export interface SongListLeft extends SongToAddLeft {
    id: string;
}

export interface SongToAddLeft {
    title: string,
    category: string,
    text?: string,
    semitones: number,
    added?: boolean;
}

export interface SongTextItem{
    title: string,
    category: string,
    text: string,
}


export interface FullSong{
    id: string;
    title: string,
    category: string,
    text: string,
    semitones: number,
    added: boolean;
}

// export interface SongToUpdateLeft extends SongToAddLeft{
//     id: string;
// }