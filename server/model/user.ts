import { sql } from '~~/server/db'
import { default as jwt } from 'jsonwebtoken';


const generateAccessToken = (id: number, role: string) => {
  const payload = {
    id,
    role
  }
  return jwt.sign(payload, 'secret')
}


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

    //получение и декодирование токена
    const token = generateAccessToken(1, 'юзер')
    const decoderToken = jwt.verify(token, 'secret')
   
    
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