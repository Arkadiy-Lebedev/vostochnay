<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

import { useUserStore } from '../stores/user.store'
import type { ILoginUser, IUser } from '@/types/user.types'
import type { IError } from '@/types/helper.types'

   const {userInfo} = useUserStore()


const user = reactive<ILoginUser>({
    phone: '',
    password: null
})

const errors = reactive<IError>({
    isError: false,
    text: '',
}) 

const isLoad = ref(false)

const sendLogin = async () => {
    errors.isError=false
    isLoad.value = true

  const { data, error, pending } = await useFetch<{user:IUser, token:string}, any, any>('/api/user/login', {
      method: 'POST',
      body: user,
      watch:false
    })

isLoad.value = pending.value

if(error.value){   
        errors.isError=true
        errors.text = error.value?.data?.statusMessage
    }

  if (data.value) {  
  userInfo.name = data.value.user.name
  userInfo.surname = data.value.user.surname
  userInfo.family = data.value.user.family
  userInfo.phone = data.value.user.phone
  userInfo.role = data.value.user.role
  userInfo.street = data.value.user.street
  userInfo.house = data.value.user.house
  
  localStorage.setItem('tokenUser', data.value.token)
  await navigateTo('/')
}

}

</script>

<template>

<div class="flex min-h-dvh flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Данные для входа</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" >
      <div class="w-full">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Телефон</label>
        <div class="mt-2 w-full">     
    <InputMask class="w-full" v-model="user.phone"  mask="+7(999)999-99-99" placeholder="+7(999)999-99-99" />
        </div>
      </div>
      <div class="w-full">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Пароль</label>
        <div class="mt-2 w-full">    
           <Password  v-model="user.password" toggleMask :feedback="false"/> 
   
        </div>
      </div>
      <div>
        <Button class="w-full" type="button" label="Войти"  :loading="isLoad" @click="sendLogin" />    
    </div>
      <div class="mt-3">
        <InlineMessage class="w-full" v-if="errors.isError" severity="error">{{errors.text }}</InlineMessage>
      </div>
    </form>
    <p class="mt-10 text-center text-sm text-gray-500">
        <NuxtLink to="/regin" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Регистрация</NuxtLink>
    </p>
  </div>
</div>
  </template>
  <style>

</style>