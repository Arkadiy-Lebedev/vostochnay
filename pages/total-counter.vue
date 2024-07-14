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
  server: true
})


const dataMounth = computed(() => {
  const newArray = data.value ? [...data.value?.data] : []
  return newArray.reverse().filter(el => el.date != null)
})

</script>

<template>

  <div class="container mx-auto">
  
    <div class="bg-white border-1 border-slate-200  rounded-lg p-8">
           <h3 class="text-2xl mt-12">История показаний</h3>
        <div class="card mt-1" v-if="pending">
          <Skeleton width="100%" height="6rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
          <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
        </div>
        <div v-else class="card mt-1 ">
          <Accordion :activeIndex="0" multiple>
            <AccordionTab v-for="item in dataMounth" :key="item.id"
              :header="dayjs(item.date || Date.now()).locale('ru').format('MMMM') + ' ' + dayjs(item.date || Date.now()).locale('ru').format('YYYY')">
              <div v-if="!!item.count">
              <p class="m-0">Общие показания: {{ item.count }} куб.м.</p>
              <p class="m-0">Дата: {{ dayjs(item.date).locale('ru').format('DD.MM.YY') }}</p>   
              <p class="m-0">Расход по общему счетчику: {{ item.count - item.lastCount }} куб.м. </p>           
              <p class="m-0">Расход с домов: {{ item.waterHouses }} куб.м.</p>
          
              <p class="m-0">Перерасход/утечка (расход об общему счетчику - расход с домов + оплчаенный перерсход ({{  item.differenceLastWaterHouses }}куб.м.) с прошлого месяца): 
                {{ item.differenceNowWaterHouses}} куб.м.</p>
                <p class="m-0">Общая оплата за утечку: {{ item.differenceToPay }} руб. </p>
                <template v-if="item.expenses">
                <p class="m-0">Дополнительные траты: {{ item.expenses }} руб. </p>
                <p class="m-0">{{ item.commentExpenses }} </p>                  
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