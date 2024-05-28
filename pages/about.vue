<script setup lang="ts">
const rr = ref(456)
</script>

<template>

    <section>
      <p class="gg text-gray-400">This page will be displayed at the /about route. Привет </p>
      {{ rr }}
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