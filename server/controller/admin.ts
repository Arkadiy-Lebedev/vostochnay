import { H3Event } from 'h3'
import dayjs from 'dayjs'
import * as adminModel from '~~/server/model/admin'
import { examinationToken } from '~~/server/helpers/helpers'

// получить список все показания главного счетчика
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

//передача показаний главного счетчика
export const updateCounterGeneralMain = async (evt: H3Event) => {

    const token = getHeaders(evt).authorization
    console.log('токен', token)
         const decoderToken = examinationToken(token)

         if (decoderToken.role != "admin") {
                 throw createError({
                statusCode: 500,
                statusMessage: 'Ошибка прав доступа...'
            })
         }


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
        const result = await adminModel.readForMonth({ month: month, year: +year })
        if(!result.length || (result.length>0 && result[0].lastCount > body.count)){
            throw createError({
                statusCode: 500,
                statusMessage: 'Ошибка в показаниях.'
            })
        }  
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Ошибка в показаниях.'
        })
    }
    

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


//закрыть месяц и посчитать перерасход
export const closeMonthMain = async (evt: H3Event) => {


             const token = getHeaders(evt).authorization
         const decoderToken = examinationToken(token)

         if (decoderToken.role != "admin") {
                 throw createError({
                statusCode: 500,
                statusMessage: 'Ошибка прав доступа...'
            })
    }
    
    const body = await readBody(evt) 
    console.log(body)

        if(!body.count){
    throw createError({
        statusCode: 500,
        statusMessage: 'Не верные показания.'
    })
    }

    const month = dayjs().add(1, 'month').format('MMMM')
    const year = dayjs().format('YYYY')
    

    try {
        const create = await adminModel.createCounter({ month:month, year:+year, lastCount: body.count, differenceLastWaterHouses:body.nowMonthDifferenceWaterHouses })
        const resultUpdate = await adminModel.updateCounterInCloseMonth({ waterHouses: body.waterHouse, differenceNowWaterHouses:body.nowMonthDifferenceWaterHouses,  
            differenceToPay:body.differenceToPay, id:body.id})
        return {
            data:create,
            rep:resultUpdate
        }
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
    }
}


//добавить доп расходы за месяц
export const addExpenses = async (evt: H3Event) => {

             const token = getHeaders(evt).authorization
         const decoderToken = examinationToken(token)

         if (decoderToken.role != "admin") {
                 throw createError({
                statusCode: 500,
                statusMessage: 'Ошибка прав доступа...'
            })
         }
 

    const body = await readBody(evt) 
    console.log(body)
    

    try {
     
        const result = await adminModel.addExpenses({ expenses: body.data.pay, commentExpenses: body.data.comment, id:body.data.id })
        return {
            data: result,
            status:true
        }
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
    }
}