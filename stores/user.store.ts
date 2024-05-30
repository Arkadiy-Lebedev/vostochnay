import type { IUser } from '@/types/user.types'

export const useUserStore = defineStore('userStore', () => {
  const userInfo = reactive<IUser>({
    name: '',
    surname: '',
    family: '',
    street: '',
    house: null,
    phone: '',
    role: ''
}) 


  return { userInfo }
})
