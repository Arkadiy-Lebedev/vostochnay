import { sql } from '~~/server/db'

export type UserModel = {
    id: number,
    name: string,
    surname: string,
    family: string,
    street: string,
    number: string,
    phone: string,
    role: string,
    password?: string
}

export const read = async () => {
    const result = await sql({
        query: 'SELECT id, name, surname, family, street, number, phone, role FROM users'
    })
    return result as UserModel[]
}

export const create = async (data: Pick<UserModel, 'name' | 'surname' | 'family' | 'street' | 'number' | 'phone' | 'password'>) => {
    const result = await sql({
        query: 'INSERT INTO users() name, surname, family, street, number, phone, password, role VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        values: [data.name, data.surname, data.family, data.street, data.number, data.phone, data.password, 'user']
    }) as any
    return result.length === 1 ? result[0] as UserModel : null
}