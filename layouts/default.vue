<script setup lang="ts">
const { isMobile, isDesktop, isTablet } = useDevice()
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
		</div>
	</div>
</template>
