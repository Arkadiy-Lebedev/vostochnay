import { default as jwt } from 'jsonwebtoken';
import { SECRET } from '~~/server/secret'
interface IToken{
    id: number,
    role: 'admin' | 'user'
}

export const examinationToken = (token: string | undefined) => {
    const decoderToken = token ? jwt.verify(token, SECRET) : null
    if (!decoderToken || typeof decoderToken === 'string') {
      throw createError({
            statusCode: 500,
            statusMessage: 'Ошибка токена'
        })
  }
  return decoderToken as IToken
}