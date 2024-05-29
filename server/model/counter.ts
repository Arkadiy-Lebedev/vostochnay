import { sql } from '~~/server/db'

export type ItemModel = {
    year: string,
    month: string,
    count: number,
    toPay: number,
    pay: number,
    datePay: string,
    isPay: boolean,
    payOur: number,
    comment: string
}

export type CounterModel = {
    id: number,
    id_user: number,
    items: ItemModel[],
    lastCount: string,
    dateLastCount: number,
    comment: string   
}


export const read = async () => {
    const result = await sql({
        query: 'SELECT  c.id, c.items, c.lastCount, c.dateLastCount, c.comment, p.id AS id_user FROM list c LEFT JOIN users p ON c.id_user = p.id'
    })
    return result as CounterModel[]
}

export const create = async (data: Pick<CounterModel, 'items' |  'id_user' | 'lastCount' | 'dateLastCount'>) => {
    const result = await sql({
        query: 'INSERT INTO users() items,  id_user, lastCount, dateLastCount VALUES (?, ?, ?, ?)',
        values: [data.items, data.id_user, data.lastCount, data.dateLastCount]
    }) as any
    return result.length === 1 ? result[0] as CounterModel : null
}