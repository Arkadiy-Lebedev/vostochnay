import { H3Event } from 'h3'
import * as settingsModel from '~~/server/model/settings'
import { examinationToken } from '~~/server/helpers/helpers'

//чтение всех пользователей
export const read = async () => {
    try {
        const result = await settingsModel.read()
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

//общее сообщение всем
export const updateAllMessage = async (evt: H3Event) => {

    const body = await readBody(evt) 
console.log(body)

     const token = getHeaders(evt).authorization
     const decoderToken = examinationToken(token)

     if (decoderToken.role != "admin") {
             throw createError({
            statusCode: 500,
            statusMessage: 'Ошибка прав доступа ...'
        })
     }


try {   

const result = await settingsModel.updateAllMessage({ id: body.id, message: body.message}) 
    
     return{
        data:result
     }      
} 

catch {
throw createError({
    statusCode: 500,
    statusMessage: 'Произошла ошибка ...'
})
}
 }
