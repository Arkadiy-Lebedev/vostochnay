<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const router = useRouter()

type TUser = {
     phone: string,
     name: string,
     surname: string,
     family: string,
    password: string | null,
    repeatPassword: string | null,
    street:'',
    house: number | null
}

type TError = {
  isError: boolean,
  text: string,
  
}


const streets = ref<{street:string}[]>([
    { street: 'Восточная',},
    { street: 'НСТ Тюльпан'},
    { street: 'НСТ Восход'},
]);

const isLoad = ref(false)

const user = reactive<TUser>({
    phone: '',
    name: '',
     surname: '',
     family: '',
    password:  null,
    repeatPassword:  null,
    street: '',
    house: null,

}) 

const errors = reactive<TError>({
    isError: false,
    text: '',
}) 
const sendRegin = async () => {
  errors.isError = false
  isLoad.value = true
  // if(user.password != user.repeatPassword){
  //   error.isError = true
  //   error.text = "Пароли не совпадают"
  //   return
  // }

//   let key: keyof typeof user;
//   for ( key in user) {
//  if(!user[key] || user[key] == ''){
//   error.isError = true
//     error.text = "Все поля обязательны для заполнения"
//   return 
//  }
// }
const formData = {...user}
const { data, error, pending   } = await useFetch('/api/user/regin', {
    method: 'POST',
  body:  formData
})

isLoad.value = pending.value

if(error.value){   
        errors.isError=true
        errors.text = error.value?.data?.statusMessage
        return
    }

    if(data.value.data.status){
      router.push({ path: "/login" })
    }

}


</script>

<template>
<div class="flex min-h-dvh flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Регистрация</h2>
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
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Фамилия</label>
        <div class="mt-2 w-full">     
    <InputText class="w-full" v-model="user.family"  placeholder="" />
        </div>
      </div>
      <div class="w-full">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Имя</label>
        <div class="mt-2 w-full">     
    <InputText class="w-full" v-model="user.name"  placeholder="" />
        </div>
      </div>
      <div class="w-full">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Отчество</label>
        <div class="mt-2 w-full">     
    <InputText class="w-full" v-model="user.surname"  placeholder="" />
        </div>
      </div>
  <div class="w-full">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Улица</label>
        <div class="mt-2 w-full">     
          <Dropdown v-model="user.street" :options="streets" optionValue="street"  optionLabel="street" placeholder="Выберите улицу" class="w-full md:w-14rem" />
        </div>
      </div>
      <div class="w-full flex gap-5 items-center">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Номер дома</label>
        <div class="mt-2 ">     
          <InputNumber class="w-28" v-model="user.house" />
        </div>
      </div>

      <div class="w-full">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Пароль</label>
        <div class="mt-2 w-full">
          <Password  v-model="user.password" toggleMask :feedback="false"/>
        </div>
      </div>
      <div class="w-full">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Повторный пароль</label>
        <div class="mt-2 w-full">
          <Password  v-model="user.repeatPassword" toggleMask :feedback="false"/>
        </div>
      </div>
      <div>
        <Button class="w-full" type="button" label="Регистрация" :loading="isLoad"  @click="sendRegin" /> 
       
      </div>
      <div class="mt-3">
        <InlineMessage class="w-full" v-if="errors.isError" severity="error">{{errors.text }}</InlineMessage>
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-500">

      <NuxtLink to="/login" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Авторизироваться</NuxtLink>
    </p>
  </div>
</div>
  </template>
  <style>
.p-inputnumber-input{
 
}

.p-inputwrapper, .p-password-input{
   width: 100%;
}
</style>