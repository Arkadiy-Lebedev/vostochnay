<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import type { ItemAdminModel } from '~~/server/model/admin'

const { data, refresh, pending } = await useFetch<{ data: ItemAdminModel[]}>('/api/admin/count', {
  // headers: {
  //   Authorization: String(tokenCookie.value),
  // },
  server: false
})


const dataMounth = computed(() => {
  const newArray = data.value ? [...data.value?.data] : []
  return newArray.reverse().filter(el => el.date != null)
})

</script>

<template>

<div class="container mx-auto" v-if="pending">
   <div class="bg-white border-2 border-slate-200  rounded-2xl p-8" >
      
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
        </div>

  </div>

  <div v-else class="container mx-auto">
  
    <div class="bg-white border-2 border-slate-200  rounded-lg p-8">
           <h3 class="text-xl font-semibold" >Показания общего счетчика</h3> 
        <div class="card mt-5 ">
          <Accordion :activeIndex="0" multiple>
            <AccordionTab v-for="item in dataMounth" :key="item.id"
              :header="dayjs(item.date || Date.now()).locale('ru').format('MMMM') + ' ' + dayjs(item.date || Date.now()).locale('ru').format('YYYY')">
              <div v-if="!!item.count">
              <p class="mt-2"><span class="font-semibold">Общие показания: </span>{{ item.count }} куб.м.</p>
              <p class="mt-2"><span class="font-semibold">Дата:</span> {{ dayjs(item.date).locale('ru').format('DD.MM.YY') }}</p>   
              <p class="mt-2"><span class="font-semibold">Расход по счетчику:</span> {{ item.count - item.lastCount }} куб.м. </p>           
              <p class="mt-2"><span class="font-semibold">Расход с домов:</span> {{ item.waterHouses }} куб.м.</p>
          
              <p class="mt-2"><span class="font-semibold">Перерасход/утечка:</span> {{ item.differenceNowWaterHouses}} куб.м. <br><span class="text-sm text-gray-500">(расход об общему счетчику - расход с домов + оплчаенный перерсход ({{  item.differenceLastWaterHouses }}куб.м.) с прошлого месяца):</span> 
                {{ item.differenceNowWaterHouses}} куб.м.</p>
                <p class="mt-2"><span class="font-semibold">Общая оплата за утечку:</span> {{ item.differenceToPay }} руб. </p>
                <template v-if="item.expenses">
                <p class="mt-2"><span class="font-semibold">Дополнительные траты:</span> {{ item.expenses }} руб. </p>
                <p class="mt-2">{{ item.commentExpenses }} </p>                  
                </template>

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