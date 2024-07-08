import { H3Event } from 'h3'
import * as settingsModel from '~~/server/model/settings'


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
