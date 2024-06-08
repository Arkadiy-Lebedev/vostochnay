import { H3Event } from 'h3'
import dayjs from 'dayjs'
import * as adminModel from '~~/server/model/admin'


export const read = async () => {
    
    try {
        const result = await adminModel.read()
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

export const updateCounterGeneralMain = async (evt: H3Event) => {
    const token = getHeaders(evt).authorization

//вставить обратоку токена на роль администратор

    const body = await readBody(evt) 
    console.log(body)

        if(!body.count){
    throw createError({
        statusCode: 500,
        statusMessage: 'Не верные показания.'
    })
    }

    const month = dayjs().format('MMMM')
    const year = dayjs().format('YYYY')
    

    try {
        const result = await adminModel.updateCounterGeneralMain({ count: body.count, date: Date.now(), month: month, year:+year })
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