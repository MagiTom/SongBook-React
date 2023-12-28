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

export const SongList: SongPageItem[] = [{
    id: '1',
    category: 'thanksgiving',
    title: `jdjdjdjdj`,
    text:   
    `    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma

    ref
    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma
    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma
    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma
    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma
    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma`
    
},
{
    id: '2',
    category: 'worship',
    title: `jdjdjdj2222dj`,
    text:   
    `    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma

    ref
    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma`
    
},
{
    id: '3',
    category: 'request',
    title: `jdjdjdj2222djaa`,
    text:   
    `    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma
    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma
    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma
    G C Em        D  
    Mabuhay kayong mga di pangkaraniwan 
    G C Em D 
    Pag-ibig ninyo ay walang hangganan 
    G C Em D 
    Mabuhay kayong lubos ang katapatan 
    C D G 
    Mabuhay kayo kailanma`
    
}
]