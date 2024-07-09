<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import type { CounterModel } from '~~/server/model/counter'
import type { ISettingsModel } from '~~/server/model/settings'

/* TODO
 * добавить topay сумму к оплате
 */

//FIXME

console.log(dayjs().millisecond(1))

const tokenCookie = useCookie('tokenUser')
const counterUser = ref<CounterModel>()
const settings = ref<ISettingsModel>()
const difference = ref<number | null>(null)
const differenceToPay = ref<number | null>(null)
const readings = ref<number | null>(null)

const dataMounth = computed(() => {
	const newArray = counterUser.value ? [...counterUser.value?.items] : []
	return newArray.reverse()
})

const isNowMonth = computed(() => {
	let status = false
	counterUser.value?.items.forEach(el => {
		if (el.month == dayjs().format('MMMM')) {
			status = true
		}
	})
	return status
})

const findNowMonth = computed(() => {
	return counterUser.value?.items.find(
		el =>
			el.month == dayjs().format('MMMM') && el.year == dayjs().format('YYYY')
	)
})

const { data, refresh, pending } = await useFetch('/api/counter/user', {
	onResponse({ response }) {
		counterUser.value = response._data.data[0]
		settings.value = response._data.setting[0]
		difference.value = response._data.difference
		differenceToPay.value = response._data.differenceToPay
		console.log(response._data.data)
	},
	headers: {
		Authorization: String(tokenCookie.value),
	},
	server: false,
})

const sendData = async () => {
	if (!readings.value) {
		alert('показания должны быть заполнены')
		return
	}

	const differenceLastWater =
		readings.value - (counterUser.value ? counterUser.value?.lastCount : 0)
	const toPay =
		differenceLastWater * (settings.value?.price ? settings.value?.price : 0)

	const { error } = await useFetch('/api/counter/add', {
		method: 'POST',
		body: {
			lastCount: readings.value,
			differenceLastWater: differenceLastWater,
			toPay: toPay,
		},
		headers: {
			Authorization: String(tokenCookie.value),
		},
	})
	refresh()
}

const total = computed(() => {
	const toPayNow: number = findNowMonth.value?.toPay
		? findNowMonth.value?.toPay
		: 0
	const toPayDifference = differenceToPay.value ? differenceToPay.value : 0
	return toPayNow + toPayDifference
})

const totalPay = computed(() => {
	const toPayHouse: number = findNowMonth.value?.pay
		? findNowMonth.value?.pay
		: 0
	const toPayOur = findNowMonth.value?.payOur
		? findNowMonth.value?.payOur
		: 0
	return toPayHouse + toPayOur
})


</script>

<template>
	<div class="container mx-auto">
		<div class="bg-white border-1 border-slate-200 rounded-lg p-8">
			<div class="flex flex-row-reverse justify-between">
				<div class="w-96">
					<Panel header="Общая информация:">
						<div class="flex gap-3 items-center mb-3">
							<p class="font-semibold">1 куб.м.:</p>
							<div class="">
								<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
								<Tag
									v-else
									class="text-lg"
									severity="Info"
									:value="settings?.price + ' руб.'"
								></Tag>
							</div>
						</div>
					</Panel>
				</div>

				<div class="">
					<div class="flex gap-3 items-center mb-3">
						<p>Последние переданные показания:</p>
						<div class="">
							<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
							<Tag
								v-else
								class="text-lg"
								severity="secondary"
								:value="counterUser?.lastCount + ' куб.м.'"
							></Tag>
						</div>
					</div>
					<div class="flex gap-3 items-center mb-3">
						<p>Дата:</p>
						<div class="">
							<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
							<Tag
								v-else
								class="text-lg"
								severity="secondary"
								:value="
									dayjs(counterUser?.dateLastCount)
										.locale('ru')
										.format('DD.MM.YY')
								"
							></Tag>
						</div>
					</div>
					<div
						v-if="findNowMonth?.differenceLastWater"
						class="flex gap-3 items-center mb-3"
					>
						<p>Расход за месяц:</p>
						<div class="">
							<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
							<Tag
								v-else
								class="text-lg"
								severity="secondary"
								:value="findNowMonth?.differenceLastWater + ' куб.м.'"
							>
							</Tag>
						</div>
					</div>
					<div v-if="findNowMonth?.toPay" class="flex gap-3 items-center mb-3">
						<p>К оплате:</p>
						<div class="">
							<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
							<Tag
								v-else
								class="text-lg"
								severity="secondary"
								:value="findNowMonth?.toPay + ' руб.'"
							></Tag>
						</div>
					</div>
				</div>
			</div>
			<div v-if="!pending" class="">
				<div v-if="!isNowMonth" class="">
					<div class="mt-5 mb-5 flex items-center gap-x-4">
						<h4 class="flex-none font-semibold leading-6 text-indigo-600">
							Передать показания
						</h4>
						<div class="h-px flex-auto bg-gray-100"></div>
					</div>
					<div class="flex gap-2 mt-3">
						<InputNumber
							v-model="readings"
							inputId="withoutgrouping"
							:placeholder="counterUser?.lastCount.toString()"
							:min="0"
							:useGrouping="false"
						/>
						<Button @click="sendData" :disabled="pending" label="Передать" />
					</div>
				</div>
				<div v-else class="mt-5 mb-5">
					<InlineMessage severity="success"
						>В этом месяце показания переданы</InlineMessage
					>
				</div>
			</div>
			<div v-if="difference">
				<Divider />
				<div class="flex gap-3 items-center mb-3">
					<p>Перерасход по общей трубе:</p>
					<div class="">
						<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
						<Tag
							v-else
							class="text-lg"
							severity="secondary"
							:value="difference + ' куб.м.'"
						></Tag>
					</div>
				</div>
				<div class="flex gap-3 items-center mb-3">
					<p>К оплате за месяц:</p>
					<div class="">
						<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
						<Tag
							v-else
							class="text-lg"
							severity="secondary"
							:value="differenceToPay + ' руб.'"
						></Tag>
					</div>
				</div>
				<Divider />
			</div>
			<div class="flex gap-3 items-center mb-3">
				<p>Итого:</p>
				<div class="">
					<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
					<Tag
						v-else
						class="text-lg"
						severity="danger"
						:value="total + ' руб.'"
					></Tag>
				</div>
			</div>
			<div class="flex gap-3 items-center mb-3">
				<p>Оплачено:</p>
				<div class="">
					<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
					<Tag
						v-else
						class="text-lg"
						severity="success"
						:value="totalPay + ' руб.'"
					></Tag>
				</div>
			</div>

			<h3 class="text-2xl mt-12">История показаний</h3>
			<div class="card mt-1" v-if="pending">
				<Skeleton width="100%" height="6rem"></Skeleton>
				<Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
				<Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
			</div>
			<div v-else class="card mt-1">
				<Accordion :activeIndex="0" multiple>
					<AccordionTab
						v-for="data in dataMounth"
						:key="data.datePay"
						:header="dayjs(data.dateCount).locale('ru').format('MMMM')"
					>
						<p class="m-0">Показания: {{ data.count }} куб.м.</p>
						<p class="m-0">Расход: {{ data.differenceLastWater }} куб.м.</p>
						<p class="m-0">
							Дата: {{ dayjs(data.dateCount).locale('ru').format('DD.MM.YY') }}
						</p>
						<p class="m-0">
							К оплате: {{ data.toPay }} руб. Оплачено: {{ data.pay }} руб.
						</p>
						<p class="m-0">Оплачено за общие нужды: {{ data.payOur }}</p>
					</AccordionTab>
				</Accordion>
			</div>
		</div>
	</div>
</template>
