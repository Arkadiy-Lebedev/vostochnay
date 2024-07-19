<script setup lang="ts">
interface Props {
  month: string,
  count: number | null,
  date: string,
  lastCount: number,
  consumption: number,
  waterHouses: number | null,
  differenceLastWaterHouses: number,
  differenceNowWaterHouses: number | null,
  differencePaySingleHouses: string | null,
  totalToPay: string | null,
  expenses: number | null
  commentExpenses: string

}
const props = defineProps<Props>()


</script>
<template>
  <div class="px-4 sm:px-0 mt-5">
    <h3 class="text-xl font-semibold leading-7 text-gray-900">Показания за {{
      props.month }}</h3>

  </div>
  <div class="mt-6 border-t border-gray-100">
    <dl class="divide-y divide-gray-100">
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class=" font-medium leading-6 text-gray-900 ">Общие показания</dt>
        <dd class="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ props.count }} куб.м. / {{
          props.date }} г.</dd>
      </div>
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="   font-medium leading-6 text-gray-900">Предыдущие показания</dt>
        <dd class="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ props.lastCount }} куб.м.
        </dd>
      </div>
      <div v-if="props.consumption" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="   font-medium leading-6 text-gray-900">Расход</dt>
        <dd class="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ props.consumption }} куб.м.</dd>
      </div>
      <div v-if="waterHouses" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="   font-medium leading-6 text-gray-900">Расход с домов</dt>
        <dd class="mt-1  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ props.waterHouses }}</dd>
      </div>
      <div v-if="differenceNowWaterHouses" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="   font-medium leading-6 text-gray-900">Перерасход/утечка <br /> <span
            class="mt-1 max-w-2xl text-xs leading-none text-gray-500">(С учетом оплаченного перерасхода с
            прошлого месяца {{ props.differenceLastWaterHouses }} куб.м.)</span> </dt>
        <dd class="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 font-semibold">{{ props.differenceNowWaterHouses
        }} куб.м. = {{ differencePaySingleHouses }} руб.</dd>
      </div>
      <template v-if="props.expenses">
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="   font-medium leading-6 text-gray-900">Дополнительные траты</dt>
          <dd class="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ props.expenses
          }} руб</dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="   font-medium leading-6 text-gray-900">Описание</dt>
          <dd class="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ props.commentExpenses
          }}</dd>
        </div>
      </template>
      <div v-if="totalToPay" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="font-medium leading-6 text-gray-900 font-semibold">Итого с каждого дома: <br /> </dt>       
        	<Tag class="text-lg mt-3 sm:mt-0" severity="warn" :value="props.totalToPay+ ' руб.'"></Tag>
      </div>
    </dl>
  </div>
</template>

<style scoped></style>