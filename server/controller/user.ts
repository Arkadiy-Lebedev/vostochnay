import { H3Event } from 'h3'
import bcrypt from "bcrypt";
import * as userModel from '~~/server/model/user'
import { default as jwt } from 'jsonwebtoken';
import {SECRET} from '~~/server/secret'


const generateAccessToken = (id: number, role: string) => {
  const payload = {
    id,
    role
  }
  return jwt.sign(payload, SECRET)
}

//чтение всех пользователей
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

// создание 
export const create = async (evt: H3Event) => {
   const body = await readBody(evt)
   console.log(body)

   if (body.phone == '' || body.street == '' || !body.house) {
    throw createError({
        statusCode: 500,
        statusMessage: 'Заполните обязательные поля'
    })
    return
}
          
    if (body.password != body.repeatPassword || !body.password || !body.repeatPassword) {
    throw createError({
        statusCode: 500,
        statusMessage: 'Пароли не совпадают'
    })
}  

    
      const userForPhone = await  userModel.readOneForReginPhone({phone:body.phone}) 
        if (userForPhone.length > 0) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Такой пользователь существует'
        })
	}

    const userForStreet = await  userModel.userOneForReginStreet({number:body.house, street: body.street}) 
    console.log(userForStreet)
        if (userForStreet.length > 0) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Пользователь с таким адресом уже существует'
        })
	}
    
    const salt = await bcrypt.genSalt(10)
	const passwordHash = await bcrypt.hash(body.password, salt) 

      try {
        
        const result = await userModel.create({          
            name: body.name,
            surname:  body.surname,
            family:  body.family,
            street:  body.street,
            number:  body.house,
            phone:  body.phone,          
            password:  passwordHash
        })
        
        return {
            data:{
               result:result,
               status: true
            }
        }
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
    }
}



//авторизация при входе
export const loginUser = async (evt: H3Event) => {
    const body = await readBody(evt)    
    console.log(body)

    const user = await  userModel.readOneForReginPhone({phone:body.phone}) 
    if (user.length == 0) {
    throw createError({
        statusCode: 500,
        statusText: 'Неверный логин или пароль!'
    })
}
const validPassword = bcrypt.compareSync(body.password, user[0].password)

if (!validPassword) {
    throw createError({
        statusCode: 500,
        statusMessage: 'Неверный логин или пароль!'
    })
}

    try {
    //получение токена
    const token = generateAccessToken(user[0].id, user[0].role)
        // const decoderToken = jwt.verify(token, SECRET)
        
        const dataUser = {
                    name: user[0].name,
                    surname: user[0].surname,
                    family: user[0].family,
                    street: user[0].street,
                    house: user[0].number,
                    phone: user[0].phone,
                    role: ''
        }

        if (user[0].role !== "user") {
            dataUser.role = user[0].role
        }
     
        return {
                token:token,
                user: dataUser    
        }
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Произошла ошибка при чтении...'
        })
    }
}

