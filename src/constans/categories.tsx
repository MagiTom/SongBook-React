export type Category = {
id: number,
key: string,
name: string
}

export const categories: Category[] = [
    {
        id: 1,
        key: 'thanksgiving',
        name: 'dziękczynienie'
},
{
    id: 2,
    key: 'worship',
    name: 'uwielbienie'
},
{
    id: 3,
    key: 'request',
    name: 'prośba'
},
{
    id: 4,
    key: '',
    name: 'wszystkie'
}
]