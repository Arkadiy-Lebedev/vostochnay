import { sql } from '~~/server/db'
import { default as jwt } from 'jsonwebtoken';


export interface UserModel {
    id: number,
    name: string,
    surname: string,
    family: string,
    street: string,
    number: string,
    phone: string,
    role: string,
    password: string,
    dateCreated: string,
}


//чтение всех
export const read = async () => {
 
    const result = await sql({
        query: 'SELECT id, name, surname, family, street, number, phone, role FROM users'
    })
    return result as UserModel[]
}

//чтение на проверку при регистрации
export const readOneForReginPhone = async (data: Pick<UserModel, 'phone'>) => {   
    const result = await sql({
        query: 'SELECT * FROM users WHERE phone = ? ',
        values: [data.phone]
    })
    return result as UserModel[]
}
// ищем пользователя по улице
export const userOneForReginStreet = async (data: Pick<UserModel, 'street' | 'number'>) => {   
   console.log(data)
    const result = await sql({
        query: 'SELECT * FROM users WHERE street = ? AND number = ?',
        values: [data.street, data.number]
    })
    return result as UserModel[]
}



// создание юзера
export const create = async (data: Pick<UserModel, 'name' | 'surname' | 'family' | 'street' | 'number' | 'phone' | 'password'>) => {
    console.log(data)
    const result = await sql({
        query: 'INSERT INTO users( name, surname, family, street, number, phone, password, role, dateCreated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        values: [data.name, data.surname, data.family, data.street, data.number, data.phone, data.password, 'user', Date.now()]
    }) as any
    console.log('результат', result)
    return result
}

// ищем пользовтаеля по id
export const readUserForId = async (data: Pick<UserModel, 'id'>) => {   

    const result = await sql({
        query: 'SELECT id, name, surname, family, street, number, phone, role FROM users WHERE id = ? ',
        values: [data.id]
    })
    return result as UserModel[]
}