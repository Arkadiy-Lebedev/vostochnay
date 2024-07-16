<script setup lang="ts">
import type { IError } from '@/types/helper.types'
interface ICount {
    id:number ,
    count: number | null
}

interface Props {
    id: number,
    count: number,
    price: number | null
   }

const tokenCookie = useCookie('tokenUser')


const errors = reactive<IError>({
    isError: false,
    text: '',
}) 
const isLoad = ref(false)
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'closeModal'): void,
  (e: 'refresh'): void
}>()


const countUser= reactive<ICount>({
    id: props.id,
    count: null,

})

const updateFetch = async ()=> {
  
errors.isError = false
if(!countUser.count || countUser.count <= props.count || !props.price){
  errors.isError = true
		errors.text = `Показания не могут быть меньше переданных ранее ${props.count} куб.м.`
  return
}

isLoad.value= true
  const differenceLastWater =  countUser.count - props.count
	const toPay = differenceLastWater * props.price

  const { error } = await useFetch('/api/admin/send-count', {
    method: 'POST',
    body: {
      id: countUser.id,
      lastCount: countUser.count,
			differenceLastWater: differenceLastWater,
			toPay: toPay,
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
  emit('refresh')
 isLoad.value= false
}


</script>
<template>
        <div >       

          <p class="text-surface-500 dark:text-surface-400 block mb-3 text-lg font-semibold">Передать показания</p>
          <p class="text-surface-500 dark:text-surface-400 block mb-1 text-gray-600 text-sm">Последние показания:</p>
          <InputNumber  class="w-full" v-model="countUser.count" inputId="withoutgrouping" :placeholder="props.count.toString()" :min="0" :useGrouping="false" />
          <InlineMessage class="mt-3 w-full "  v-if="errors.isError" severity="error">{{errors.text }}</InlineMessage>
            <div class="flex justify-end gap-2 mt-5">              
                <Button type="button" label="Отмена" severity="secondary" @click="emit('closeModal')"></Button>
                <Button type="button" label="Передать" @click="updateFetch" :loading="isLoad"></Button>
            </div>
                 </div>

</template>

<style scoped>
.month {
  text-transform: capitalize;

}
</style>