<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { useUserStore } from '../stores/user.store'
const { userInfo } = useUserStore()

import type { CounterModelAndMain, CounterModelAndMainAdmin } from '~~/server/model/counter'
import type { ItemAdminModel } from '~~/server/model/admin'
import type { ISettingsModel } from '~~/server/model/settings'

type  dialogStatusContent = 'pay' | 'message' | 'count'

/*TODO:
* при закрытии месяца нужно создават следующий месяц в базе куда передапть count в поле lastcount 
и nowMonthDifferenceWaterHouses- перерасход в текущем месяце в differenceLastWaterHouses

*/
const tokenCookie = useCookie('tokenUser')
const date = ref()
const isDialog = ref(false)
const isDialogDop = ref(false)
const isDialogAllMessage = ref(false)
const isLoading = ref(false)
const enterUser = ref<CounterModelAndMain | null>(null)
const dialogContent = ref<dialogStatusContent>('pay')
const userMessage = reactive<{  id: number;  message:string}>({  id: 0,  message:'' })

const month = computed(() => {
  return dayjs(date.value).format('MMMM')
})
const year = computed(() => {
  return dayjs(date.value).format('YYYY')
})

// / counter / all - read - admin
let link = '/api/counter/all-read'
if (userInfo.role == 'admin') {
  link = '/api/counter/all-read-admin'
}
const { data, refresh, pending } = await useFetch<{ data: CounterModelAndMain[] & CounterModelAndMainAdmin[], main: ItemAdminModel[], setting: ISettingsModel[] }>(link, {
  query: { month: month, year: year },
  // headers: {
  //   Authorization: String(tokenCookie.value),
  // },
  server: false,

})

const calculateMonth = async () => {
  isLoading.value = true
  const waterHouse = data.value?.data.reduce((accumulator, el) => {
    if (el.items.length > 0 && el.items[0].differenceLastWater) {
      return accumulator + el.items[0].differenceLastWater
    } else {
      return accumulator
    }
  }, 0)
  const differenceWater = data.value ? ((data.value?.main[0].count||0) - data.value?.main[0].lastCount - ((waterHouse ? waterHouse : 0) + (data.value?.main[0].differenceLastWaterHouses))) : 0

  const { error } = await useFetch('/api/admin/count/create', {
    method: 'POST',
    body: {
      id: data.value?.main[0].id,
      waterHouse: waterHouse,
      count: data.value?.main[0].count,
      nowMonthDifferenceWaterHouses: differenceWater,
      differenceToPay: differenceWater * (data.value?.setting[0].price ? data.value?.setting[0].price : 0)
    },
    headers: {
      Authorization: String(tokenCookie.value),
    }
  })
  refresh()
  isLoading.value = false
}



const listUserDuty = computed(() => {
  const newArray = data.value?.data.map(el => {
    if (el.items.filter(item => item.isPay == false || item.isOurPay == false).length > 0) {
      return el
    } else {
      return
    }
  })
  return newArray?.filter(el => el != null)
})

const listUserGetCount = computed(() => {
  const newArray = data.value?.data.map(el => {
    if (el.items.length == 0) {
      return el
    } else {
      return
    }
  })
  return newArray?.filter(el => el != null)
})


// const nowMonthDifferenceWaterHouses = computed(() => data.value ? (data.value?.main[0].count - data.value?.main[0].lastCount - (data.value?.main[0].waterHouses + data.value?.main[0].differenceLastWaterHouses)) : 0)
const differencePayHouses = computed(() => {
  if (data.value && data.value?.main[0].differenceNowWaterHouses) {
    return (data.value?.main[0].differenceNowWaterHouses * (data.value?.setting[0].price || 0)).toFixed(2)
  }
  else {
    return null
  }
})

const totalToPay = computed(() => {
  if (data.value && data.value?.main[0].differenceToPay) {
    return (((data.value?.main[0].differenceToPay + (data.value?.main[0].expenses || 0)) / (data.value.setting[0].houses - data.value.setting[0].exclude))).toFixed(2)
  }
  else {
    return null
  }
})



// data.value?.main[0].differenceNowWaterHouses ? data.value?.main[0].differenceNowWaterHouses : 0) / (data.value.setting[0].houses - data.value.setting[0].exclude))

const setUser = (id: number) => {
  dialogContent.value = 'pay'
 
  isDialog.value = true
  const user = data.value?.data.find(el => el.id == id)
  if (user) {
    enterUser.value = user
  } else {
    enterUser.value = null
  }
}


const messageUser = (id: number) => {
  dialogContent.value = 'message'

  isDialog.value = true
    userMessage.id = id
  const user = data.value?.data.find(el => el.id == id)
  if (user) {
     enterUser.value = user
    
  } else {
    enterUser.value = null
  }
}

const countSendUser = (id: number) => {
  dialogContent.value = 'count'
  isDialog.value = true
  const user = data.value?.data.find(el => el.id == id)
  if (user) {
    enterUser.value = user
  } else {
    enterUser.value = null
  }
}



const refreshData = () => {
  isDialog.value = false
  isDialogDop.value = false
  isDialogAllMessage.value = false
  refresh()
}

const nowMonth = computed(() => {
  if (dayjs().format('MMMM') == data.value?.main[0].month) {
    return dayjs().locale('ru').format('MMMM')
  }
  else {
    return null
  }
})


let today = new Date()


const dataFilter = computed(() => {
    return data.value?.data
})

const filter = () => {
 
  data.value?.data.sort((a,b) => {
    if (a.items[0].isPay > b.items[0].isPay) {
      return 1
    }
    if (a.items[0].isPay < b.items[0].isPay) {
      return -1
    }
    // a должно быть равным b
    return 0
  })
}

</script>

<template>
  <div class="container mx-auto" v-if="pending">
   <div class="bg-white border-2 border-slate-200  rounded-2xl p-8" >
          <Skeleton width="100%" height="6rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
        </div>
        <div class="bg-white border-2 border-slate-200  rounded-2xl p-8 mt-8" >
          <Skeleton width="100%" height="3rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
          <Skeleton width="100%" height="10rem" class="mt-3"></Skeleton>
        </div>
  </div>

   <div v-else class="container mx-auto">

    <div  class="bg-white border-2 border-slate-200  rounded-2xl p-8 ">   
      <div  v-if="userInfo.role == 'admin'" class="flex gap-3 flex-wrap mb-7">
        <Button   @click="isDialogDop = true" label="Добавить расходы" icon="pi pi-list" outlined size="small"/>       
      <Button @click="isDialogAllMessage = true" label="Сообщение всем" icon="pi pi-envelope" outlined size="small"/>      
      </div>  
      <div v-if="data?.setting[0].message" class="mb-10">
        <InlineMessage severity="warn">Общее сообщение: {{ data?.setting[0].message }} </InlineMessage>
      </div>
      <div class="w-52">
         <Calendar :maxDate="today"  showIcon fluid v-model="date" view="month" dateFormat="MM" placeholder="Выбирете месяц" />      
      </div>
     
      <div class="sm:grid sm:grid-cols-3 mt-7">
        <div v-if="data?.main && data?.main.length > 0" class="col-span-2">
          <div v-if="!data?.main[0].count && userInfo.role == 'admin'" >         
            <Sendcount :month="nowMonth" :lastCount="data?.main[0].lastCount" @refresh="refresh()"></Sendcount>
          </div>
          <div v-else>
            <InfoDataMain 
            :month="dayjs(date).locale('ru').format('MMMM')"
            :count="data?.main[0].count" 
            :date="dayjs(data?.main[0].date).locale('ru').format('DD.MM.YY')"
            :consumption="(data?.main[0].count ? data?.main[0].count : 0) - (data?.main[0].lastCount ? data?.main[0].lastCount : 0)"
            :waterHouses="data?.main[0].waterHouses"
            :lastCount="data?.main[0].lastCount"
            :differenceLastWaterHouses="data?.main[0].differenceLastWaterHouses"
            :differenceNowWaterHouses="data?.main[0].differenceNowWaterHouses"            
            :differencePaySingleHouses="differencePayHouses"
            :totalToPay="totalToPay"
            :expenses="data?.main[0].expenses"  
            :commentExpenses="data?.main[0].commentExpenses" 
            ></InfoDataMain>
         
          </div>

        </div>
        <div v-else class="col-span-2 mt-10">
          <InlineMessage severity="warn"> Данные не найдены</InlineMessage>
        </div>


      </div>



      
    </div>

  <div class="bg-white border-2 border-slate-200  rounded-2xl p-8 sm:mt-8 mt-5">
    <div class="sm:p-2 ">
         
         <div class="p-1 mt-2 sm:p-1 border-2 border-purple-300 rounded-2xl ">

           <Button class="mb-10" v-if="!data?.main[0] || !data?.main[0].waterHouses" @click="calculateMonth"
             label="Рассчитать месяц" icon="pi pi-calculator"
             :disabled="(listUserGetCount ? listUserGetCount?.length : 0) > 0"
             :loading="isLoading" />

           <Accordion :activeIndex="0" multiple>
           <AccordionTab 
             :header="'Не оплатили:' + ' ' + listUserDuty?.length+ ' чел.' ">
             <div class="mt-2" v-for="data in listUserDuty" :key="data?.id">
             <Tag severity="warning" value="Warning"> {{ data?.street + ' д. ' + data?.number }} </Tag>
           </div>
            
           </AccordionTab>
         </Accordion>
         </div>
       </div>
    <p @click="filter" class="text-xl font-semibold leading-7 text-gray-900 mt-10 mb-6">По домам:</p>
      <DataTable :value="dataFilter" tableStyle="min-width: 40rem">
        <Column v-if="userInfo.role == 'admin'" header="ФИО" style="width: 200px">
            <template #body="slotProps">
              <p @click="setUser(slotProps.data.id)" class="hover:opacity-75 cursor-pointer underline"> {{ slotProps.data.family }} {{ slotProps.data.name }} {{ slotProps.data.surname }} <br> <span>{{ slotProps.data.street }} {{ slotProps.data.number }}</span></p>
              <p class="mt-2">{{ slotProps.data.phone }}</p>
               <div v-if="month ==  dayjs().format('MMMM')" class="mt-1 flex gap-3">
                <Button  @click="messageUser(slotProps.data.id)" text rounded icon="pi pi-envelope" aria-label="Filter" size="small" />
                <Button v-if="!slotProps.data.items[0]?.count" @click="countSendUser(slotProps.data.id)" text rounded icon="pi pi-file-edit" aria-label="Filter" size="small" />
              </div>              
             
            </template>
          </Column>
        <Column v-if="userInfo.role != 'admin'" header="Адрес">
          <template #body="slotProps">
            <p class=""> {{ slotProps.data.street }} {{ slotProps.data.number }}</p>
          </template>
        </Column>
         <Column header="Оплата" style="width: 50px">
          <template #body="slotProps">
            <div v-if="slotProps.data.items.length > 0">
              <Tag v-if="slotProps.data.items[0].isPay" severity="success" value="Оплачено"></Tag>
              <Tag v-else severity="danger" value="Долг"></Tag>

              <div class="flex flex-col mt-2">
                <p class="text-xs">Общие:</p>
                <div class="">
                  <Tag v-if="slotProps.data.items[0].payOur >= (totalToPay||0)" severity="success" value="Оплачено"></Tag>
                  <Tag v-else severity="danger" value="Долг"></Tag>
                </div>

              </div>
            </div>

          </template>
        </Column>
        <Column header="Расход" style="width: 50px">
          <template #body="slotProps">
            {{ slotProps.data.items.length > 0 ? slotProps.data.items[0].differenceLastWater : 'не переданы' }}
          </template>
        </Column>
        <Column v-if="userInfo.role == 'admin'" header="Сообщения" style="width: 350px">
          <template #body="slotProps">
            <p v-if="slotProps.data.items[0]?.comment" class="text-sm text-gray-600"><span class="font-semibold">За месяц:</span> {{ slotProps.data.items[0].comment }}</p>
              <p v-if="slotProps.data?.comment" class="text-sm text-gray-600"><span class="font-semibold">Общее:</span> {{ slotProps.data.comment }}</p>
          </template>
        </Column>    
   
      </DataTable>

    </div>
  </div>

  <div class="card flex justify-center">

    <Dialog v-model:visible="isDialog" modal :header="enterUser?.street + ' ' + enterUser?.number"
      :style="{ width: '25rem' }">
    <Formpay v-if="dialogContent == 'pay'" :user="enterUser" @closeModal="isDialog= false" :difference="totalToPay"
      @refresh="refreshData"></Formpay>

      <div v-else-if="dialogContent == 'message'" class="">
      <FormMessageUser :id="userMessage.id" :message="enterUser?.comment || ''" @closeModal="isDialog= false"  @refresh="refreshData"></FormMessageUser>
      </div>
<div v-else-if="dialogContent == 'count'" class="">
      <FormCountUser :id="enterUser?.id_user || 0" :count="enterUser?.lastCount || 0" @closeModal="isDialog= false" :price="data?.setting[0].price || null"  @refresh="refreshData"></FormCountUser>
      </div>
      
  </Dialog>

     <Dialog v-model:visible="isDialogDop" modal header="Добавить расходы"
        :style="{ width: '25rem' }">
      <FormAddExpenses  :id="data?.main[0].id || 0" @closeModal="isDialogDop = false" :pay="data?.main[0].expenses || null" :comment="data?.main[0].commentExpenses || ''"  @refresh="refreshData"></FormAddExpenses>
        </Dialog>

        <Dialog v-model:visible="isDialogAllMessage" modal header="Общее уведомление"
        :style="{ width: '25rem' }">
      <FormMessageAll  :id="data?.setting[0].id || 0" :message="data?.setting[0].message || ''" @closeModal="isDialogAllMessage= false"  @refresh="refreshData"></FormMessageAll>
        </Dialog>
</div></template>

<style>.p-accordion-header-text::first-letter {
  text-transform: uppercase;
}</style>