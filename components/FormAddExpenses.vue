<script setup lang="ts">
const tokenCookie = useCookie('tokenUser')

interface Props {
  id: number,
  pay: number | null,
  comment: string ,
}
const props = defineProps<Props>()

interface IExpenses {
  id: number,
  pay: number | null,
comment: string,
}

const expenses = reactive<IExpenses>({
  id: props.id,
  pay: props.pay,
  comment: props.comment,
})

const emit = defineEmits<{
  (e: 'closeModal'): void,
   (e: 'refresh'): void
}>()

const addFetch = async () => {
  console.log(456)


  const { error } = await useFetch('/api/admin/add-expenses', {
    method: 'PUT',
    body: {
      data: expenses
    },
    headers: {
      Authorization: String(tokenCookie.value),
    }
  })
  console.log(error.value)
  if (error.value) {
    /*TODO:
* обработать ошибки и вывести

*/
    return
  }
  emit('refresh')


}

</script>
<template>
      <div class="">
          <div class="flex flex-col gap-2 mb-4">
                  <label for="pay" class="font-semibold w-24">Сумма:</label>
                  <InputNumber v-model="expenses.pay" id="pay" class="flex-auto" />                
              </div>
              <Textarea class="w-full" v-model="expenses.comment" autoResize rows="5" placeholder="Описание" />
               <div class="flex justify-end gap-2 mt-2">
                  <Button type="button" label="Отмена" severity="secondary" @click="emit('closeModal')"></Button>
                  <Button type="button" label="Сохранить" @click="addFetch"></Button>
              </div>
      </div>
</template>

<style scoped>
.month {
  text-transform: capitalize;

}
</style>