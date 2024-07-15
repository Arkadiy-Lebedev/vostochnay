<script setup lang="ts">

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

const sendData = async () => {
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
  pending.value = false
    emit('refresh')
}

</script>
<template>
  <div class="mt-10 flex items-center gap-x-4">
    <h4 class="flex-none font-semibold leading-6 text-indigo-600">Передать показания за {{ month }}</h4>
    <div class="h-px flex-auto bg-gray-100"></div>
  </div>
  <div class="flex gap-2 mt-3 ">
    <InputNumber v-model="readings" inputId="withoutgrouping" :placeholder="props.lastCount + ' куб.м.'" :min="0"
      :useGrouping="false" suffix=" куб.м."/>
    <Button @click="sendData" :loading="pending" label="Передать" />
  </div>

</template>

<style scoped>

</style>