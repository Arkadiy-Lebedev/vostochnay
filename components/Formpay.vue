<script setup lang="ts">
import type { CounterModelAndMain } from '~~/server/model/counter'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

interface IPay {
    pay: number | null,
    outPay: number | null
}

interface Props {
    user: CounterModelAndMain | null
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const payUser = reactive<IPay>({
    pay: props.user ? props.user?.items[0].pay : null,
    outPay:props.user ? props.user?.items[0].payOur : null
})

</script>
<template>
        <p class="text-surface-500 dark:text-surface-400 block">Месяц: <span class="font-semibold">{{ dayjs(user?.items[0].dateCount).locale('ru').format('MMMM') }}</span> </p>
        <p class="text-surface-500 dark:text-surface-400 block ">Показания: <span class="font-semibold">{{ user?.items[0].count }} куб.м. от {{ dayjs(user?.items[0].dateCount).locale('ru').format('DD.MM.YY') }}</span> </p>
        <p class="text-surface-500 dark:text-surface-400 block ">К оплате: <span class="font-semibold">{{ user?.items[0].toPay }} руб.</span> </p> 

    <div class="flex items-center gap-4 mb-4">
                <label for="pay" class="font-semibold w-24">Оплачено:</label>
                <InputNumber v-model="payUser.pay" id="pay" class="flex-auto" />                
            </div>
        
<div class="flex items-center gap-4 mb-4">
                <label for="pay" class="font-semibold w-24">Общие:</label>
                <InputNumber v-model="payUser.outPay" id="pay" class="flex-auto" />                
            </div>
        

            <p class="text-surface-500 dark:text-surface-400 block ">{{ user?.items[0].comment }}</p> 
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="emit('closeModal')"></Button>
                <!-- <Button type="button" label="Save" @click="isDialog = false"></Button> -->
            </div>
</template>