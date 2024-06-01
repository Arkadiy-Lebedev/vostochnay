<script setup lang="ts">
import dayjs from 'dayjs'

import type { CounterModel } from '~~/server/model/counter'


console.log(dayjs().millisecond(1))

 const tokenCookie = useCookie('tokenUser')
const counterUser = ref<CounterModel >()
const readings = ref<number | null>(null)
 

   const { data, refresh, pending } = await useFetch('/api/counter/user', {
    onResponse({ response }) {
      counterUser.value=response._data.data[0]
      console.log(response._data.data)
  },
    headers: {
      Authorization: String(tokenCookie.value),
    },
    server:false
  })



const sendData = async () => {
const { error  } = await useFetch('/api/counter/add', {
    method: 'POST',
  body: {      
      lastCount: readings.value, 
    },
      headers: {
      Authorization: String(tokenCookie.value),
    }
  })
  refresh()
} 

const tabs = ref([
    { title: 'Май 2024', count: '326' },
    { title: 'Апрель 2024', count: '150' },
    { title: 'Март 2024', count: '60' }
]);



</script>

<template>
<p v-if="pending">Загрузка</p>
<div class="container mx-auto">
  <div class="bg-white border-1 border-slate-200  rounded-lg p-8">
       <div class="flex gap-3 items-center">
        <p>Последние показания: {{ counterUser }} </p> 
        <Tag class="text-lg" severity="secondary" :value="counterUser?.lastCount + ' куб.м.'"></Tag> 
       </div>
<div class="flex gap-3 items-center">
        <p>Дата: </p> 
        <Tag  class="text-lg"  severity="secondary" value="15.05.2024"></Tag> 
       </div>
   
        <div class="mt-10 flex items-center gap-x-4">
          <h4 class="flex-none font-semibold leading-6 text-indigo-600">Передать показания</h4>
          <div class="h-px flex-auto bg-gray-100"></div>
        </div>

        <div class="flex gap-2 mt-3 ">         
              <InputNumber  v-model="readings" inputId="withoutgrouping" placeholder="Показания" :min="0"  :useGrouping="false" />
            <Button @click="sendData" label="Передать" />
        </div>
<h3 class="text-2xl mt-12">История показаний</h3>
        <div class="card mt-1">
        <Accordion :activeIndex="0">
            <AccordionTab v-for="tab in tabs" :key="tab.title" :header="tab.title">
                <p class="m-0">Показания: {{ tab.count }}</p>
                <p class="m-0">Дата: {{ tab.count }}</p>
                <p class="m-0">К оплате: 230. Оплачено: {{ tab.count }}</p>
                <p class="m-0">Оплачено за общие нужды: {{ tab.count }}</p>
            </AccordionTab>
        </Accordion>
    </div>

      
    </div>


</div>
  </template>