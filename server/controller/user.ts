import { H3Event } from 'h3'
import * as userModel from '~~/server/model/user'

export const read = async () => {
    try {
        const result = await userModel.read()
        return {
            data:result
        }
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
    }
}

export const create = async (evt: H3Event) => {
    try {
        const body = await readBody(evt)
        //описать создание юзера
        const pass = '123'
        
        const result = await userModel.create({          
            name: body.name,
            surname:  body.surname,
            family:  body.family,
            street:  body.street,
            number:  body.number,
            phone:  body.phone,          
            password:  pass
        })
        return {
            data:result
        }
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
    }
}