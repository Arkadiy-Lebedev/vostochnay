<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import type { CounterModelAndMain } from '~~/server/model/counter'
import type { ItemAdminModel } from '~~/server/model/admin'

console.log(dayjs().millisecond(1))

/*TODO:
* при закрытии месяца нужно создават следующий месяц в базе куда передапть count в поле lastcount 
и nowMonthDifferenceLastWaterHouses- перерасход в текущем месяце в differenceLastWaterHouses

*/

const date = ref();

const month = computed(() => {  
 return dayjs(date.value).format('MMMM')
})
const year = computed(() => {  
 return dayjs(date.value).format('YYYY')
})


const { data, refresh, pending } = await useFetch<{ data: CounterModelAndMain[], main: ItemAdminModel[] }>('/api/counter/all-read', {  
    query: { month: month, year: year },
  // headers: {
  //   Authorization: String(tokenCookie.value),
  // },
  server: false,

})

const listUserDuty = computed(() => {
  
  const newArray = data.value?.data.map(el => {
    if (el.items.filter(item => item.isPay == false || item.payOur == null).length > 0) {
      
        return el
    } else {
      return 
    }  
  })
  

  return newArray?.filter(el => el != null)
})


const nowMonthDifferenceLastWaterHouses = computed(() => data.value ? data.value?.main[0].count - data.value?.main[0].lastCount - (data.value?.main[0].waterHouses + data.value?.main[0].differenceLastWaterHouses) : 0)


</script>

<template>

  <div class="container mx-auto">
    <div class="bg-white border-1 border-slate-200  rounded-lg p-8">
  <Calendar v-model="date" view="month" dateFormat="mm.yy" placeholder="Выбирете месяц"/>
  <div class="sm:grid sm:grid-cols-3">
 <div v-if="data?.main && data?.main.length > 0" class="col-span-2">
    <div class="px-4 sm:px-0 mt-5">
      <h3 class="text-xl font-semibold leading-7 text-gray-900">Показания за {{ dayjs(date).locale('ru').format('MMMM') }}</h3>

    </div>
    <div class="mt-6 border-t border-gray-100">
      <dl class="divide-y divide-gray-100">
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Общие показания</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{data?.main[0].count}} куб.м. / {{ dayjs(data?.main[0].date).locale('ru').format('DD.MM.YY') }}</dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Предыдущие показания</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ data?.main[0].lastCount }} куб.м.</dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Расход</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ (data?.main[0].count ? data?.main[0].count : 0) - (data?.main[0].lastCount ? data?.main[0].lastCount : 0) }} куб.м.</dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Расход с домов</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ data?.main[0].waterHouses }}</dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium leading-6 text-gray-900">Перерасход/утечка <br/> <span class="mt-1 max-w-2xl text-xs leading-none text-gray-500">(С учетом оплаченного перерасхода с прошлого месяца {{ data?.main[0].differenceLastWaterHouses }} куб.м.)</span> </dt>
          <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ nowMonthDifferenceLastWaterHouses }} куб.м.</dd>
        </div>
      </dl>
    </div>
  </div>

  <div class="p-7  ">  
    <div class="p-7 border-2 border-indigo-200 rounded-2xl">
<p class=" text-base font-semibold leading-7 text-gray-900 ">Не олпатили:  {{ listUserDuty?.length }} человек</p> 
  <div class="mt-2" v-for="data in listUserDuty" :key="data?.id" >
    <Tag severity="warning" value="Warning"> {{ data?.street }} </Tag>
  </div>
    </div> 
   
  </div>
    
  </div>
 


<p class="text-xl font-semibold leading-7 text-gray-900 mt-7 mb-6">По домам</p>
   <DataTable :value="data?.data" tableStyle="min-width: 50rem">      
              <Column header="Адрес">
                  <template #body="slotProps">
              {{ slotProps.data.street }} {{ slotProps.data.number }}
                  </template>
              </Column>
              <Column header="Расход" >
            <template #body="slotProps" >
              {{ slotProps.data.items.length>0 ? slotProps.data.items[0].differenceLastWater : 'не переданы'   }}
          </template>
              </Column>
               <Column header="Оплата" >
              <template #body="slotProps" >
                <div v-if="slotProps.data.items.length > 0">
                  <Tag v-if="slotProps.data.items[0].isPay" severity="success" value="Оплачено"></Tag>
                  <Tag v-else severity="danger" value="Долг"></Tag>
                  
                  <div class="flex flex-col mt-2">
                   <p class="text-xs">Общие:</p> 
                   <div class="">
                    <Tag v-if="slotProps.data.items[0].payOur" severity="success" value="Оплачено"></Tag>
                    <Tag v-else severity="danger" value="Долг"></Tag>
                   </div>
                 
                  </div>
                </div>
              
            </template>
                </Column>
              
              <template #footer> In total there are  products. </template>
          </DataTable>

</div>
</div>
</template>

<style>
.p-accordion-header-text::first-letter {
  text-transform: uppercase;
}
</style>