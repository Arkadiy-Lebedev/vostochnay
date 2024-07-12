<script setup lang="ts">
import type { CounterModelAndMain } from '~~/server/model/counter'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

interface IPay {
    id:number,
    pay: number | null,
    outPay: number | null,
    comment: string | null,
    isPay: boolean,
    month:string,
    year:string,
}

interface Props {
    user: CounterModelAndMain | null,
    difference: string | null}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'closeModal'): void,
  (e: 'refresh'): void
}>()



const payUser = reactive<IPay>({
    id: props.user ? props.user?.id_user : 0,
    pay: props.user ? props.user?.items[0].pay : null,
    outPay:props.user ? props.user?.items[0].payOur : null,
    comment:props.user ? props.user?.items[0].comment : null,
    isPay:false,
    month:props.user?.items[0].month ? props.user?.items[0].month : "",
    year: dayjs(props.user?.items[0].dateCount).locale('ru').format('YYYY')
})

const updateFetch = async ()=> {
console.log(456)
    if(props.user?.items[0].pay && payUser.pay&& payUser.pay>=props.user?.items[0].pay  ){
        payUser.isPay = true
    }

  const { error } = await useFetch('/api/admin/count/update-pay', {
    method: 'POST',
    body: {
      data:payUser     
    },
    // headers: {
    //   Authorization: String(tokenCookie.value),
    // }
  })
  emit('refresh')


}


</script>
<template>
        <p class="text-surface-500 dark:text-surface-400 block mb-4"><span class="font-semibold text-xl month">{{ dayjs(user?.items[0].dateCount).locale('ru').format('MMMM') }}</span> </p>
        <Fieldset legend="С дома">
  <p class="text-surface-500 dark:text-surface-400 block mb-4">Показания: <span class="font-semibold">{{ user?.items[0].count }} куб.м. от {{ dayjs(user?.items[0].dateCount).locale('ru').format('DD.MM.YY') }}</span> </p>
        <p class="text-surface-500 dark:text-surface-400 block mb-4">К оплате: <span class="font-semibold">{{ user?.items[0].toPay }} руб.</span> </p> 

    <div class="flex flex-col gap-2 mb-4">
                <label for="pay" class="font-semibold w-24">Оплачено:</label>
                <InputNumber v-model="payUser.pay" id="pay" class="flex-auto" />                
            </div>

</Fieldset>

<Fieldset class="mt-5" legend="Общие">
            <p class="text-surface-500 dark:text-surface-400 block mb-4">К оплате: <span class="font-semibold">{{ props.difference}} руб.</span> </p> 
<div class="flex flex-col gap-2 mb-4">
                <label for="pay" class="font-semibold w-24">Оплачено:</label>
                <InputNumber v-model="payUser.outPay" id="pay" class="flex-auto" />                
            </div>
</Fieldset>     

        
            <Textarea class="w-full mt-5" v-model="payUser.comment" rows="3"  placeholder="Комментарий"/>
        
            <div class="flex justify-end gap-2 mt-2">
                <Button type="button" label="Отмена" severity="secondary" @click="emit('closeModal')"></Button>
                <Button type="button" label="Сохранить" @click="updateFetch"></Button>
            </div>
</template>

<style scoped>
.month {
  text-transform: capitalize;

}
</style>