<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import type { ItemAdminModel } from '~~/server/model/admin'

console.log(dayjs().millisecond(1))

const readings = ref<number | null>(null)

const { data, refresh, pending } = await useFetch<{ data: ItemAdminModel[]}>('/api/admin/count', {
  // headers: {
  //   Authorization: String(tokenCookie.value),
  // },
  server: true
})

const sendData = async () => {
  const { error } = await useFetch('/api/admin/count', {
    method: 'PUT',
    body: {
      count: readings.value,
    },
    // headers: {
    //   Authorization: String(tokenCookie.value),
    // }
  })
  refresh()
}



const nowMonth = computed(()=> data.value?.data.find(el => el.month == dayjs().format('MMMM')))
const lastMonth = computed(() => data.value?.data[data.value?.data.length-1])

</script>

<template>

  <div class="container mx-auto">
  
    <div class="bg-white border-1 border-slate-200  rounded-lg p-8">



         <div v-if="!!!nowMonth?.count" class="">
            <div class="mt-10 flex items-center gap-x-4">
              <h4 class="flex-none font-semibold leading-6 text-indigo-600">Передать показания</h4>
              <div class="h-px flex-auto bg-gray-100"></div>
            </div>
            <div class="flex gap-2 mt-3 ">
              <InputNumber v-model="readings" inputId="withoutgrouping" :placeholder="nowMonth?.lastCount.toString()"
                :min="0" :useGrouping="false" />
              <Button @click="sendData" :disabled="pending" label="Передать" />
            </div>
          </div>
          <div v-else class="mt-10">
            <InlineMessage severity="success">В этом месяце показания переданы</InlineMessage>
          </div>

           <h3 class="text-2xl mt-12">История показаний</h3>
        <div class="card mt-1" v-if="pending">
          <Skeleton width="100%" height="6rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
        </div>
        <div v-else class="card mt-1 ">
          <Accordion :activeIndex="0">
            <AccordionTab v-for="item in data?.data" :key="item.id"
              :header="dayjs(item.date ? item.date : Date.now()).locale('ru').format('MMMM')">
              <div v-if="!!item.count">
              <p class="m-0">Общие показания: {{ item.count }}</p>
              <p class="m-0">Дата: {{ dayjs(item.date).locale('ru').format('DD.MM.YY') }}</p>   
              <p class="m-0">Расход по общему счетчику: {{ item.count - item.lastCount }} </p>           
              <p class="m-0">Расход с домов: {{ item.waterHouses }} </p>
               <p class="m-0">Оплаченный перерасход с прошлого месяца: {{ item.differenceLastWaterHouses }} </p>
              <p class="m-0">Перерасход/утечка (расход об общему счетчику - расход с домов + оплчаенный перерсход с прошлого месяца): 
                {{ item.count - item.lastCount - (item.waterHouses + item.differenceLastWaterHouses)}} </p>
              </div>
              <div v-else>
  <InlineMessage severity="info">Показания еще не переданы</InlineMessage>
              </div>
             
            </AccordionTab>
          </Accordion>
        </div>
      
    </div>


</div></template>

<style>
.p-accordion-header-text::first-letter {
  text-transform: uppercase;
}
</style>