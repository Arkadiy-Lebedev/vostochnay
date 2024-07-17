import { sql } from '~~/server/db'


export interface ISettingsModel {
    id: number,
    price: number | null,
    houses: number,
    exclude: number,
    message: string,
}


//чтение всех
export const read = async () => {

 
    const result = await sql({
        query: 'SELECT * FROM settings'
    })
    return result as ISettingsModel[]
}

//общее сообщение всем
export const updateAllMessage = async (data: Pick<ISettingsModel, 'id' |  'message' >) => {   
    console.log('дата',data)
    const result = await sql({
        query: 'UPDATE settings SET message = ? WHERE id=?',
        values: [ data.message,  data.id]
    }) as any

    return result.length === 1 ? result[0] as ISettingsModel : null
}
