import { sql } from '~~/server/db'

export type ItemAdminModel = {
    id: number,
    year: number,
    month: string,
    count: number | null,
    img: string,
    date: number | null,
    waterHouses: number | null,
    lastCount: number,
    differenceLastWaterHouses: number,
    differenceNowWaterHouses: number | null,
    differenceToPay: number | null,
    expenses: number | null,
    commentExpenses:string
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

export const createCounter = async (data: Pick<ItemAdminModel,'month' | 'year' | 'lastCount' | 'differenceLastWaterHouses'>) => {   
    console.log("данные create", data)
    const result = await sql({
        query: 'INSERT INTO main ( month, year, lastCount, differenceLastWaterHouses) VALUES (?, ?, ?, ?)',
        values: [data.month, data.year, data.lastCount, data.differenceLastWaterHouses]
    }) as any

    return result.length === 1 ? result[0] as ItemAdminModel : null
}


export const updateCounterInCloseMonth = async (data: Pick<ItemAdminModel, 'waterHouses' | 'differenceNowWaterHouses' | 'differenceToPay' |  'id' >) => {   

    const result = await sql({
        query: 'UPDATE main SET waterHouses = ?, differenceNowWaterHouses =?, differenceToPay =?  WHERE id=?',
        values: [data.waterHouses, data.differenceNowWaterHouses, data.differenceToPay, data.id]
    }) as any

    return result.length === 1 ? result[0] as ItemAdminModel : null
}

//добавить доп расходы 
export const addExpenses = async (data: Pick<ItemAdminModel, 'expenses' | 'commentExpenses' |  'id' >) => {   

    const result = await sql({
        query: 'UPDATE main SET expenses = ?, commentExpenses =?  WHERE id=?',
        values: [data.expenses, data.commentExpenses,  data.id]
    }) as any

    return result
}