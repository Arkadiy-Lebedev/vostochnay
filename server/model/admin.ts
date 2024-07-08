import { sql } from '~~/server/db'

export type ItemAdminModel = {
    id: number,
    year: number,
    month: string,
    count: number,
    img: string,
    date: number | null,
    waterHouses: number,
    lastCount: number,
    differenceLastWaterHouses: number,
    differenceNowWaterHouses: number | null,
    differenceToPay: number | null,
}




export const read = async () => {  
    const result = await sql({
        query: 'SELECT  * FROM main '
    })  
    return result as ItemAdminModel[]
}

export const readForMonth = async (data: Pick<ItemAdminModel, 'month' | 'year'>) => {  
    const result = await sql({
        query: 'SELECT * FROM main WHERE month=? AND year=?',
        values: [data.month, data.year]
    })  
    return result as ItemAdminModel[] | []
}


export const updateCounterGeneralMain = async (data: Pick<ItemAdminModel, 'count' | 'date' | 'month' | 'year'>) => {   
    console.log("данные", data)
    const result = await sql({
        query: 'UPDATE main SET count = ?, date =? WHERE month=? AND year=?',
        values: [data.count, data.date, data.month, data.year]
    }) as any

    return result.length === 1 ? result[0] as ItemAdminModel : null
}

