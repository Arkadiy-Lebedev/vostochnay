<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/ru'


import type { CounterModel } from '~~/server/model/counter'


console.log(dayjs().millisecond(1))

const tokenCookie = useCookie('tokenUser')
const counterUser = ref<CounterModel>()
const readings = ref<number | null>(null)

const dataMounth = computed(() => {
  const newArray = counterUser.value ? [...counterUser.value?.items] : []
  return newArray.reverse()
})

const iaNowMonth = computed(() => {
  let status = false
  counterUser.value?.items.forEach(el => {
    if (el.month == dayjs().format('MMMM')) {
      status = true
    }
  })
  return status
})


const { data, refresh, pending } = await useFetch('/api/counter/user', {
  onResponse({ response }) {
    counterUser.value = response._data.data[0]
    console.log(response._data.data)
  },
  headers: {
    Authorization: String(tokenCookie.value),
  },
  server: false
})



const sendData = async () => {
  const { error } = await useFetch('/api/counter/add', {
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



</script>

<template>
  <div class="container mx-auto">
    <div class="bg-white border-1 border-slate-200  rounded-lg p-8">
      <div class="flex gap-3 items-center">
        <p>Последние показания: </p>
        <div class="">

          <Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
          <Tag v-else class="text-lg" severity="secondary" :value="counterUser?.lastCount + ' куб.м.'"></Tag>
        </div>


      </div>
      <div class="flex gap-3 items-center">
        <p>Дата: </p>
        <div class="">
          <Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
          <Tag v-else class="text-lg" severity="secondary"
            :value="dayjs(counterUser?.dateLastCount).locale('ru').format('DD.MM.YY')"></Tag>
        </div>

      </div>
      <div v-if="!pending" class="">
        <div v-if="!iaNowMonth" class="">
          <div class="mt-10 flex items-center gap-x-4">
            <h4 class="flex-none font-semibold leading-6 text-indigo-600">Передать показания</h4>
            <div class="h-px flex-auto bg-gray-100"></div>
          </div>
          <div class="flex gap-2 mt-3 ">
            <InputNumber v-model="readings" inputId="withoutgrouping" :placeholder="counterUser?.lastCount.toString()"
              :min="0" :useGrouping="false" />
            <Button @click="sendData" :disabled="pending" label="Передать" />
          </div>
        </div>
        <div v-else class="mt-10">
          <InlineMessage severity="success">В этом месяце показания переданы</InlineMessage>
        </div>
      </div>





      <h3 class="text-2xl mt-12">История показаний</h3>
      <div class="card mt-1" v-if="pending">
        <Skeleton width="100%" height="6rem"></Skeleton>
        <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
        <Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
      </div>
      <div v-else class="card mt-1 ">
        <Accordion :activeIndex="0">
          <AccordionTab v-for="data in dataMounth" :key="data.datePay"
            :header="dayjs(data.dateCount).locale('ru').format('MMMM')">
            <p class="m-0">Показания: {{ data.count }}</p>
            <p class="m-0">Дата: {{ data.dateCount }} {{ dayjs(data.dateCount).locale('ru').format('DD.MM.YY') }}</p>
            <p class="m-0">К оплате: 230. Оплачено: {{ data.datePay }}</p>
            <p class="m-0">Оплачено за общие нужды: {{ data.payOur }}</p>
          </AccordionTab>
        </Accordion>
      </div>


    </div>


</div></template>