export interface SongToAdd {
    title: string,
    category: string,
    text: string,
}

export interface SongListItem {
    id: string,
    title: string,
    category: string,
}

export interface SongItem extends SongListItem {
    semitones?: number,
    added?: boolean,
}

export interface SongPageItem extends SongItem {
    text: string,
}
