<script setup lang="ts">
// import { useUserQuery } from '@/components/hooks/useUserQuery'
// import type { UserModel } from '~~/server/model/user'

// const users = ref<UserModel[]>([])


//  const { isLoading, data } =  useUserQuery()

//  users.value = data.value?.data as UserModel[]



</script>

<template>

    <section>
      <p class="gg text-gray-400">This page will be displayed at the /about route. Привет </p>

    </section>
    <InputText type="text"  />
    <Button label="Check" />
  </template>
  <style>
.gg {
  font-family: Roboto;
  font-weight: 400;

}
</style>