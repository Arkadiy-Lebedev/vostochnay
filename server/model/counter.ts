import { sql } from '~~/server/db'
import type {UserModel} from '~~/server/model/user'

export interface ItemModel {
    year: string,
    month: string,
    count: number,
    dateCount: number,
    toPay: number | null,
    pay: number | null,
    datePay: number | null,
    isPay: boolean,
    payOur: number | null,
    comment: string,
    differenceLastWater: number | null,
}

export type CounterModel = {
    id: number,
    id_user: number,
    items: ItemModel[],
    lastCount: number,
    dateLastCount: number,
    comment: string   
}

export interface CounterModelAndMain extends Pick<UserModel, 'id' |  'street' | 'number'> {
    id: number,
    id_user: number,
    items: ItemModel[],
    lastCount: number,
    dateLastCount: number,
    comment: string   
}


export const read = async () => {   
    const result = await sql({
        query: 'SELECT  c.id, c.items, c.lastCount, c.dateLastCount, c.comment, p.id AS id_user, p.street, p.number FROM list c LEFT JOIN users p ON c.id_user = p.id'
    })  
    return result as CounterModelAndMain[]
}


export const readForId = async (data: { id: number }) => {
    const result = await sql({
        query: 'SELECT  c.id, c.items, c.lastCount, c.dateLastCount, c.comment, c.id_user FROM list c WHERE c.id_user = ?',
         values: [data.id]
    })
    return result as CounterModel[]
}



export const create = async (data: Pick<CounterModel, 'items' |  'id_user' | 'lastCount' | 'dateLastCount'>) => {

    const result = await sql({
        query: 'INSERT INTO list  (id_user, items, lastCount, dateLastCount)  VALUES (?, ?, ?, ?)',
        values: [data.id_user, JSON.stringify(data.items),  data.lastCount, data.dateLastCount]
    }) as any

    return result.length === 1 ? result[0] as CounterModel : null
}

// export const update = async (data: Pick<CounterModel, 'items' |  'id_user' | 'lastCount' | 'dateLastCount'>) => {   
//     const result = await sql({
//         query: 'UPDATE list SET items = ?, lastCount = ?, dateLastCount =? WHERE id_user=?',
//         values: [ JSON.stringify(data.items),  data.lastCount, data.dateLastCount, data.id_user]
//     }) as any

//     return result.length === 1 ? result[0] as CounterModel : null
// }

export const updateCounterInAddMonthUser = async (data: Pick<CounterModel, 'items' |  'id_user' | 'lastCount' | 'dateLastCount'>) => {   
    const result = await sql({
        query: 'UPDATE list SET items = ?, lastCount = ?, dateLastCount =? WHERE id_user=?',
        values: [ JSON.stringify(data.items),  data.lastCount, data.dateLastCount, data.id_user]
    }) as any

    return result.length === 1 ? result[0] as CounterModel : null
}