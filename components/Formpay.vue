<script setup lang="ts">
import type { CounterModelAndMain } from '~~/server/model/counter'
import type { IError } from '@/types/helper.types'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

const tokenCookie = useCookie('tokenUser')

interface IPay {
    id:number,
    pay: number | null,
    outPay: number | null,
    comment: string | null,
  isPay: boolean,
    isOurPay: boolean,
    month:string,
    year:string,
}

interface Props {
    user: CounterModelAndMain | null,
    difference: string | null}

const props = defineProps<Props>()

const errors = reactive<IError>({
    isError: false,
    text: '',
}) 
  const isLoad = ref(false)

const emit = defineEmits<{
  (e: 'closeModal'): void,
  (e: 'refresh'): void
}>()



const payUser = reactive<IPay>({
    id: props.user ? props.user?.id_user : 0,
    pay: props.user ? props.user?.items[0]?.pay : null,
    outPay:props.user ? props.user?.items[0]?.payOur : null,
    comment:props.user ? props.user?.items[0]?.comment : null,
    isPay: false,
    isOurPay: false,
    month:props.user?.items[0]?.month ? props.user?.items[0]?.month : "",
    year: dayjs(props.user?.items[0]?.dateCount).locale('ru').format('YYYY')
})

const updateFetch = async ()=> {
if(props.difference && payUser.outPay && payUser.outPay>= +props.difference  ){
        payUser.isOurPay = true
    }
  
    if(props.user?.items[0].toPay && payUser.pay&& payUser.pay>=props.user?.items[0].toPay  ){
        payUser.isPay = true
    }
    
isLoad.value= true
  const { error } = await useFetch('/api/admin/count/update-pay', {
    method: 'POST',
    body: {
      data:payUser     
    },
    headers: {
      Authorization: String(tokenCookie.value),
    }
  })
  if(error.value){   
        errors.isError=true
        errors.text = error.value?.data?.statusMessage
        isLoad.value= false
        return
    }
    isLoad.value= false
  emit('refresh')


}


</script>
<template>
        <div v-if="user?.items[0]?.count">
                  <p class="text-surface-500 dark:text-surface-400 block mb-4"><span class="font-semibold text-xl month">{{ dayjs(user?.items[0]?.dateCount).locale('ru').format('MMMM') }}</span> </p>
        <Fieldset legend="С дома">
  <p class="text-surface-500 dark:text-surface-400 block mb-4">Показания: <span class="font-semibold">{{ user?.items[0]?.count }} куб.м. от {{ dayjs(user?.items[0]?.dateCount).locale('ru').format('DD.MM.YY') }}</span> </p>
        <p class="text-surface-500 dark:text-surface-400 block mb-4">К оплате: <span class="font-semibold">{{ user?.items[0]?.toPay }} руб.</span> </p> 

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

        
            <Textarea class="w-full mt-5" v-model="payUser.comment" rows="3"  placeholder="Сообщение к текущему месяцу"/>
            <InlineMessage class="mt-3 w-full "  v-if="errors.isError" severity="error">{{errors.text }}</InlineMessage>
            <div class="flex justify-end gap-2 mt-5">
                <Button type="button" label="Отмена" severity="secondary" @click="emit('closeModal')"></Button>
                <Button type="button" label="Сохранить" @click="updateFetch"  :loading="isLoad"></Button>
            </div>
                 </div>
                 <div v-else>
                   <InlineMessage class="w-full" severity="error"> Показания не переданы. </InlineMessage>
                 </div>
</template>

<style scoped>
.month {
  text-transform: capitalize;

}
</style>