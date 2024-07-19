
<script setup lang="ts">

import  {SwipeBottomNavigation}  from "bottom-navigation-vue"
import "bottom-navigation-vue/dist/style.css"

const route = useRoute()

const options = ref([
	{ id: 1, icon: 'pi pi-home', title: 'Главная', path: { name: "index" }},
	{ id: 2, icon: 'pi pi-box', title: 'Счетчик', path: { name: "total-counter"} },
{ id: 3, icon: 'pi pi-list', title: 'Общие', path: { name: "all-readings"} },
{ id: 4, icon: 'pi pi-cog', title: 'Настройки', path: { name: "all-readings"} },
])
const selected = ref(2)

watch(
	() => route.path,
	(count, prevCount) => {
		console.log(route.name)
		const puth = options.value.find((item) => item.path?.name === route.name)
		selected.value = puth?.id || 1
	}
)

</script>
<template>
    <SwipeBottomNavigation :options="options" v-model="selected" />
</template>