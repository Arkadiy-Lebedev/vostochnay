import { H3Event } from 'h3'
import * as counterModel from '~~/server/model/counter'

export const read = async () => {
    try {
        const result = await counterModel.read()
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

        const result = await counterModel.create({          
            id_user: body.id_user,
            items:  body.items,            
            lastCount:  body.lastCount,
            dateLastCount:  Date.now()          
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