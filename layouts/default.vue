<script setup lang="ts">
import { SwipeBottomNavigation } from "bottom-navigation-vue"
import "bottom-navigation-vue/dist/style.css"

const route = useRoute()
console.log(route.path)


watch(
	() => route.path,
	(count, prevCount) => {
		console.log(route.name)
		const puth = options.value.find((item) => item.path?.name === route.name)
		selected.value = puth?.id || 1
	}
)

const { isMobile, isDesktop, isTablet } = useDevice()

const options = ref([
	{ id: 1, icon: 'pi pi-list', title: 'Home', path: { name: "index" }, },
	{ id: 2, icon: 'pi pi-list', title: 'Search', path: { name: "total-counter"}, },

])
const selected = ref(2)

</script>
<template>
	<div class="min-h-dvh">
		<div v-if="isDesktop">
			<Menu></Menu>
			<slot />
		</div>
		<div v-else-if="isTablet">
			<Menu></Menu>
			<slot />
		</div>
		<div v-else>
			<MenuMobile></MenuMobile>

			<slot />
			<SwipeBottomNavigation :options="options" v-model="selected" />
		</div>
	</div>
</template>
