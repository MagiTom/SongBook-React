import { SongListLeft } from "./SongListLeft.model";

export interface SongListRight extends SongListLeft{
    semitones: number;
    text: string;
}