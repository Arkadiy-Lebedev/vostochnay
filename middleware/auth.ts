import { useUserStore } from '../stores/user.store'
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { userInfo } = useUserStore()
    if (userInfo.role) {
        return 
    }

    const tokenCookie = useCookie('tokenUser')
  const { data } = await useFetch('/api/auth', {

	headers: {
		Authorization: String(tokenCookie.value),
	},
     

  })
    console.log(data.value?.user)
    if (data.value?.user) {
    userInfo.name = data.value?.user[0].name
    userInfo.surname = data.value?.user[0].surname
    userInfo.family = data.value?.user[0].family
    userInfo.phone = data.value?.user[0].phone
    userInfo.role = data.value?.user[0].role
    userInfo.street = data.value?.user[0].street
    userInfo.house = data.value?.user[0].house
        return 
    } else {
        console.log(34534)
        return navigateTo('/login')
    }

     
    

})