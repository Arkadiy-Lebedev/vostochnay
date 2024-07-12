import { sql } from '~~/server/db'


export interface ISettingsModel {
    id: number,
    price: number | null,
    houses: number,
    exclude: number
}


//чтение всех
export const read = async () => {

 
    const result = await sql({
        query: 'SELECT * FROM settings'
    })
    return result as ISettingsModel[]
}
