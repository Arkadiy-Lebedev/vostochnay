import { H3Event } from 'h3'
import dayjs from 'dayjs'
import * as counterModel from '~~/server/model/counter'
import * as adminModel from '~~/server/model/admin'
import * as settingsModel from '~~/server/model/settings'
import { default as jwt } from 'jsonwebtoken';
import {SECRET} from '~~/server/secret'

const examinationToken = (token: string | undefined)=> {
    const decoderToken = token ? jwt.verify(token, SECRET) : null
    if (!decoderToken || typeof decoderToken === 'string') {
      throw createError({
            statusCode: 500,
            statusMessage: 'Ошибка токена'
        })
  }
  return decoderToken
}

export const readForCounterDateAndMain = async (evt: H3Event) => {   
    const query = getQuery(evt)
    console.log(query)
    if (query.month && query.year) {
       try {
              const result = await counterModel.read()             
              result.forEach(el => {
                  let newItems = el.items.filter(item => item.month == query.month && item.year == query.year)
                  el.items = newItems
              })
           
           const mainCounter = await adminModel.readForMonth({ month: query.month.toString(), year: +query.year })      
           const setting = await settingsModel.read()   

        return {
            data: result,
            main:mainCounter,
            setting:setting
        }
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
        }   
    }
     throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
     }

//получить данные по счетчику по обоненту по токену
export const userForToken = async (evt: H3Event) => {
 
    const token = getHeaders(evt).authorization

//     const decoderToken = token ? jwt.verify(token, SECRET) : null

//     if (!decoderToken || typeof decoderToken === 'string') {
//       throw createError({
//             statusCode: 500,
//             statusMessage: 'Ошибка токена'
//         })
//   }

const decoderToken = examinationToken(token)

    console.log(decoderToken.id)
    console.log(decoderToken.role)

    try {
        const result = await counterModel.readForId({ id: decoderToken.id })   
        const setting = await settingsModel.read()   
        let difference = await readMainNowMonth()
        if (difference.main && difference.main.length > 0) {           
             return {
                data: result,
                setting: setting,
                difference: difference.main[0].differenceNowWaterHouses,
                differenceToPay: difference.main[0].differenceToPay
            }
        }
        return {
            data: result,
            setting: setting,
            difference:null
        }
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
    }
}


//добавить показания от юзера
export const create = async (evt: H3Event) => {
    
         const body = await readBody(evt) 
        console.log(body)
         console.log('body')
             if(!body.lastCount){
            throw createError({
                statusCode: 500,
                statusMessage: 'Не верные показания.'
            })
        }

        try {   
        const token = getHeaders(evt).authorization
        const decoderToken = examinationToken(token)

        const findCounterFoIdUser = await counterModel.readForId({ id: decoderToken.id }) 
    

         const month = dayjs().format('MMMM')
        const year = dayjs().format('YYYY')
         const item = {               
                year: year,
                month: month,
                count: body.lastCount,
                dateCount: Date.now(),
                toPay: body.toPay,
                pay: null,
                datePay: null,
                isPay: false,
                payOur: null,
                comment: '',
                differenceLastWater: body.differenceLastWater
            }

            //если юзер еще никогда не передавал показания
         if(findCounterFoIdUser.length ==0){            
             const result  = await counterModel.create({id_user:decoderToken.id, lastCount: body.lastCount, dateLastCount: Date.now(), items: [item]})     
               
             return {
                data:result
             }
         } 
         else {

          const newData =  findCounterFoIdUser[0].items.find(el => el.month == month && el.year == year)
            // const newArrayItems = findCounterFoIdUser[0].items.filter(el => el.month != month)

             //проверка, если показания не пердавались в текущем месяце
          if(!newData){
            findCounterFoIdUser[0].items.push(item)
            const result  = await counterModel.updateCounterInAddMonthUser({id_user:decoderToken.id, lastCount: body.lastCount, dateLastCount: Date.now(), items: findCounterFoIdUser[0].items})     
             return{
                data:result
             }      
        }
            // newData.count = body.lastCount
            // newData.dateCount = Date.now()            
            // newArrayItems.push(newData)
       
         }
   
        return {
            error:'В этом месяца уже передавались показания'
        }
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
    }
}

//получить перерасход за текущий месяц
export const readMainNowMonth = async () => {   
    const month = dayjs().format('MMMM')
    const year = dayjs().format('YYYY') 
    console.log(month)
console.log(year)
       try {
           
           const mainCounter = await adminModel.readForMonth({month:month.toString(), year:+year})         

        return {            
            main:mainCounter
        }
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
        }    

     }
