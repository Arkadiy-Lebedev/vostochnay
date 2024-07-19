<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
})
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

const { userInfo } = useUserStore()




</script>

<template>
	<div class="container mx-auto">
		<div class="bg-white border-2 border-slate-200 rounded-lg p-8">
			<h3 class="text-xl font-semibold">Настройки</h3>
{{ userInfo }}
		</div>
	</div>
</template>

<style>

</style>
