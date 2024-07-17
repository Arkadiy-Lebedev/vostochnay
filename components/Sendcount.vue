<script setup lang="ts">
import type { IError } from '@/types/helper.types'

const tokenCookie = useCookie('tokenUser')
interface Props {
  lastCount: number,
  month: string | null
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()


const readings = ref<number | null>(null)
const pending = ref<boolean>(false)

const errors = reactive<IError>({
    isError: false,
    text: '',
}) 

const sendData = async () => {
  errors.isError = false
  // if(!readings.value){
  //   errors.isError = true
	// 	errors.text = 'Введите показания'
	// 	return
  // }

  // if(readings.value && readings.value < props.lastCount){
  //   errors.isError = true
	// 	errors.text = 'Показания не могут меньше ранее переданных'
	// 	return
  // }

  pending.value = true
  const { error } = await useFetch('/api/admin/count', {
    method: 'PUT',
    body: {
      count: readings.value,
    },
    headers: {
      Authorization: String(tokenCookie.value),
    }
  })
  if(error.value){   
        errors.isError=true
        errors.text = error.value?.data?.statusMessage
		 pending.value = false
        return
    }
  pending.value = false
    emit('refresh')
}

</script>
<template>
  <div class="mt-10 flex items-center gap-x-4">
    <h4 class="flex-none font-semibold leading-6 text-indigo-600">Передать показания за {{ month }}</h4>   
  </div>
  <div class="flex gap-2 mt-3 ">
    <InputNumber v-model="readings" inputId="withoutgrouping" :placeholder="props.lastCount + ' куб.м.'" :min="0"
      :useGrouping="false" suffix=" куб.м."/>  
    <Button @click="sendData" :loading="pending" label="Передать" />
  </div>
    <InlineMessage class="mt-5"  v-if="errors.isError" severity="error">{{errors.text }}</InlineMessage>
</template>

<style scoped>

</style>