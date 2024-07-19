<script setup lang="ts">
const { isMobile, isDesktop, isTablet } = useDevice()
</script>

<template>
	<div class="min-h-dvh">
		<div v-if="isDesktop">
			<Menu></Menu>
			<div class="wrapper-slot">
				<slot />
			</div>
		</div>
		<div v-else-if="isTablet">
			<Menu></Menu>
			<div class="wrapper-slot">
				<slot />
			</div>
		</div>
		<div v-else>
			<MenuMobile></MenuMobile>
			<div class="wrapper-slot">
				<slot />
			</div>
			<BottomNavigation></BottomNavigation>
		</div>
	</div>
</template>
<style scoped>
.wrapper-slot {
	@apply pt-5 pb-20 pl-3 pr-3  ;
}
</style>
