import { H3Event } from 'h3'
import dayjs from 'dayjs'
import * as counterModel from '~~/server/model/counter'
import * as adminModel from '~~/server/model/admin'
import * as settingsModel from '~~/server/model/settings'
import { examinationToken } from '~~/server/helpers/helpers'
import type { CounterModel as cc } from '~~/server/model/counter'

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
     
// получить данные оснвоаные для админа

export const readForCounterDateAndMainAdmin = async (evt: H3Event) => {   
    const query = getQuery(evt)
    console.log(query)
    if (query.month && query.year) {
       try {
              const result = await counterModel.readForAdmin()             
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


    try {
        const result = await counterModel.readForId({ id: decoderToken.id })   
        const setting = await settingsModel.read()   
        let difference = await readMainNowMonth()
        if (difference.main && difference.main.length > 0) {           
             return {
                data: result,
                setting: setting,
                difference: difference.main[0].differenceNowWaterHouses,
                 differenceToPay: difference.main[0].differenceToPay,
                 expenses: difference.main[0].expenses,
                commentExpenses: difference.main[0].commentExpenses
            }
        }
        return {
            data: result,
            setting: setting,
            difference:null,
            differenceToPay: null,
            expenses:null,
           commentExpenses: null
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


if( body.lastCount < findCounterFoIdUser[0].lastCount) {
        throw createError({
                statusCode: 500,
                statusMessage: 'Не верные показания.'
            })
       }


     const newArr = [...findCounterFoIdUser[0].items]

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
                isOurPay: false,
                payOur: null,
                comment: '',
                differenceLastWater: body.differenceLastWater
            }

            //если юзер еще никогда не передавал показания
         if(!findCounterFoIdUser[0]){            
             const result  = await counterModel.create({id_user:decoderToken.id, lastCount: body.lastCount, dateLastCount: Date.now(), items: [item]})     
               
             return {
                data:result
             }
         } 
         else {

          const newData =  findCounterFoIdUser[0].items.find(el => el.month == month && el.year == year)
            // const newArrayItems = findCounterFoIdUser[0].items.filter(el => el.month != month)

             //проверка, если показания не пердавались в текущем месяце
             if (!newData) {
              newArr.push(item)
            findCounterFoIdUser[0].items = newArr
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
            statusMessage: 'Ошибка данных'
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


     export const updateDataToPayForAdmin = async (evt: H3Event) => {

        const bodyData = await readBody(evt) 
        const body = bodyData.data
        console.log("боди",body)

         const token = getHeaders(evt).authorization
         const decoderToken = examinationToken(token)

         if (decoderToken.role != "admin") {
                 throw createError({
                statusCode: 500,
                statusMessage: 'Ошибка прав доступа ...'
            })
         }


try {   

    const findCounterFoIdUser = await counterModel.readForId({ id: body.id }) 


      let newData =  findCounterFoIdUser[0].items.find(el => el.month == body.month && el.year == body.year)
      let newItems =  findCounterFoIdUser[0].items.filter(el => el.month != body.month && el.year != body.year)
        // const newArrayItems = findCounterFoIdUser[0].items.filter(el => el.month != month)
       console.log(newData)
         //проверка, если показания не пердавались в текущем месяце
      if(newData){
        newData.pay = body.pay
        newData.comment = body.comment
        newData.payOur = body.outPay
        newData.isPay = body.isPay
        newData.isOurPay = body.isOurPay
        newItems.push(newData)
        
        const result  = await counterModel.updateDataToPayForAdmin({items: newItems, id_user:body.id})     
         return{
            data:result
         }      
    } 
     }
 catch {
    throw createError({
        statusCode: 500,
        statusMessage: 'Произошла ошибка ...'
    })
}
     }

     // отправка сообщения
 export const sendMessageUser = async (evt: H3Event) => {

        const bodyData = await readBody(evt) 
        const body = bodyData.data


         const token = getHeaders(evt).authorization
         const decoderToken = examinationToken(token)

         if (decoderToken.role != "admin") {
                 throw createError({
                statusCode: 500,
                statusMessage: 'Ошибка прав доступа ...'
            })
         }


try {   
        const result  = await counterModel.sendMessageUser({id:body.id , comment:body.message })     
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


     //Добавить показания администратором для юзера
     export const countSendAdminForUser = async (evt: H3Event) => {
    
        const body = await readBody(evt) 

            if(!body.lastCount){
           throw createError({
               statusCode: 500,
               statusMessage: 'Не верные показания.'
           })
       }
    
       const token = getHeaders(evt).authorization
       const decoderToken = examinationToken(token)

       if (decoderToken.role != "admin") {
        throw createError({
       statusCode: 500,
       statusMessage: 'Ошибка прав доступа...'
   })
}

   try {   
const findCounterFoIdUser = await counterModel.readForId({ id: body.id }) 
console.log(body)

if( body.lastCount < findCounterFoIdUser[0].lastCount) {
       throw createError({
               statusCode: 500,
               statusMessage: 'Не верные показания.'
           })
      }


    const newArr = [...findCounterFoIdUser[0].items]

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
               isOurPay: false,
               payOur: null,
               comment: '',
               differenceLastWater: body.differenceLastWater
           }

           //если юзер еще никогда не передавал показания
        if(!findCounterFoIdUser[0]){            
            const result  = await counterModel.create({id_user:body.id, lastCount: body.lastCount, dateLastCount: Date.now(), items: [item]})     
              
            return {
               data:result
            }
        } 
        else {

         const newData =  findCounterFoIdUser[0].items.find(el => el.month == month && el.year == year)
           // const newArrayItems = findCounterFoIdUser[0].items.filter(el => el.month != month)

            //проверка, если показания не пердавались в текущем месяце
            if (!newData) {
             newArr.push(item)
           findCounterFoIdUser[0].items = newArr
           const result  = await counterModel.updateCounterInAddMonthUser({id_user:body.id, lastCount: body.lastCount, dateLastCount: Date.now(), items: findCounterFoIdUser[0].items})     
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
           statusMessage: 'Ошибка данных'
       })
   }
}