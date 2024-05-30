import { H3Event } from 'h3'
import * as counterModel from '~~/server/model/counter'
import { default as jwt } from 'jsonwebtoken';
import {SECRET} from '~~/server/secret'

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

//получить данные по счетчику по обоненту по токену
export const userForToken = async (evt: H3Event) => {
    console.log(getHeaders(evt).authorization)
    const token = getHeaders(evt).authorization

    const decoderToken = token ? jwt.verify(token, SECRET) : null

    if (!decoderToken || typeof decoderToken === 'string') {
      throw createError({
            statusCode: 500,
            statusMessage: 'Ошибка токена'
        })
  }

    console.log(decoderToken.id)
    console.log(decoderToken.role)

    try {
          const result = await counterModel.readForId({id:decoderToken.id})       
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