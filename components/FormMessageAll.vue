<script setup lang="ts">


const tokenCookie = useCookie('tokenUser')

interface IMessage {
    id:number ,
    message: string 
}

interface Props {
    id: number,
    message: string,
   }
const props = defineProps<Props>()
  const isLoad = ref(false)
const emit = defineEmits<{
  (e: 'closeModal'): void,
  (e: 'refresh'): void
}>()



const messageUser= reactive<IMessage>({
    id: props.id,
    message: props.message,

})

const updateFetch = async ()=> {
  isLoad.value= true
  const { error } = await useFetch('/api/settings/send-message', {
    method: 'PUT',
    body: messageUser,
    headers: {
      Authorization: String(tokenCookie.value),
    }
  })
  if(error.value){   

        isLoad.value= false
        return
    }
  emit('refresh')
  isLoad.value= false
}


</script>
<template>
        <div >        
          <p class="text-surface-500 dark:text-surface-400 block mb-1">Отправить общее уведомление: </p>
            <Textarea class="w-full mt-1" v-model="messageUser.message" rows="3"  placeholder="Сообщение"/>
            <div class="flex justify-end gap-2 mt-5">              
                <Button type="button" label="Отмена" severity="secondary" @click="emit('closeModal')"></Button>
                <Button type="button" label="Отправить" @click="updateFetch" :loading="isLoad"></Button>
            </div>
                 </div>

</template>

<style scoped>

</style>