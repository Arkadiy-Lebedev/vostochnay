import { useUserStore } from '../stores/user.store'
import type { IUser } from '@/types/user.types'
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { userInfo } = useUserStore()
    if (userInfo.role) {
        return 
    }

    const tokenCookie = useCookie('tokenUser')
  const { data } = await useFetch<{user:IUser[]}>('/api/auth', {

	headers: {
		Authorization: String(tokenCookie.value),
	},
     

  })

    if (data.value?.user) {
    userInfo.name = data.value?.user[0].name
    userInfo.surname = data.value?.user[0].surname
    userInfo.family = data.value?.user[0].family
    userInfo.phone = data.value?.user[0].phone
    userInfo.role = data.value?.user[0].role
    userInfo.street = data.value?.user[0].street
    userInfo.number = data.value?.user[0].number
        return 
    } else {
        console.log(34534)
        return navigateTo('/login')
    }

     
    

})