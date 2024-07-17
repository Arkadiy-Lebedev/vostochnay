<script setup lang="ts">
definePageMeta({
	middleware: 'auth'
})
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import type { CounterModel } from '~~/server/model/counter'
import type { ISettingsModel } from '~~/server/model/settings'
import type { IError } from '@/types/helper.types'
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
const expenses = ref<number | null>(null)
const commentExpenses = ref<string>('')
const isLoad = ref(false)
const lastReadings = ref<number | null>(null)

const errors = reactive<IError>({
    isError: false,
    text: '',
}) 

const dataMounth = computed(() => {
	const newArray = counterUser.value ? [...counterUser.value?.items] : []
	return newArray.reverse()
})

const isNowMonth = computed(() => {
	let status = false	
	counterUser.value?.items.forEach(el => {
		console.log('удумент',el)
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
		expenses.value = response._data.expenses
		commentExpenses.value = response._data.commentExpenses
	},
	headers: {
		Authorization: String(tokenCookie.value),
	},
	server: false,
})

const sendData = async () => {
	errors.isError = false
	if (!readings.value) {
		errors.isError = true
		errors.text = 'Введите показания'

		return
	}

	if ( counterUser.value?.lastCount && readings.value < counterUser.value?.lastCount ) {
		errors.isError = true
		errors.isError = true
		errors.text = 'Не верные показания. Текущие показания не могут быть меньше последних переданных'
		return
	}

	if ( !counterUser.value?.lastCount ) {
		errors.isError = true
		errors.text = 'Не удалось загрузить последние показания. Попробуйте позже'
		return

	}

	isLoad.value= true

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

	if(error.value){   
        errors.isError=true
        errors.text = error.value?.data?.statusMessage
		isLoad.value= false
        return
    }
	isLoad.value= false
	refresh()
}

const differencePaySingleHouse = computed(() => {
	if (differenceToPay.value) {
		return (differenceToPay.value / (data.value.setting[0].houses - data.value.setting[0].exclude)).toFixed(2)
	}
	else {
		return null
	}
})

const expensesSingleHouse = computed(() => {
	if (expenses.value) {
		return (expenses.value / (data.value.setting[0].houses - data.value.setting[0].exclude)).toFixed(2)
	}
	else {
		return null
	}
})


const total = computed(() => {
	const toPayNow: number = findNowMonth.value?.toPay
		? findNowMonth.value?.toPay
		: 0
	const toPayDifference = differencePaySingleHouse.value ? differencePaySingleHouse.value : 0
	const toPayExpenses = expensesSingleHouse.value? expensesSingleHouse.value : 0
	
	return toPayNow + +toPayDifference + +toPayExpenses
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
					<Panel header="">
						<div class="flex gap-3 items-center mb-3">
							<p class="font-semibold">1 куб.м.:</p>
							<div class="">
								<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
								<Tag v-else class="text-lg" severity="Info" :value="settings?.price + ' руб.'"></Tag>
							</div>
						</div>
					</Panel>
				</div>

				<div class="">
					<div class="mb-8">
        <InlineMessage severity="warn">Общее сообщение: {{ data?.setting[0].message }} </InlineMessage>
      </div>
					<div class="flex gap-3 items-center mb-3">
						<p>Последние переданные показания:</p>
						<div class="">
							
							<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
							<Tag v-else class="text-lg" severity="secondary" :value="counterUser?.lastCount + ' куб.м.'">
							</Tag>
						</div>
					</div>
					<div class="flex gap-3 items-center mb-3">
						<p>Дата:</p>
						<div class="">
							<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
							<Tag v-else class="text-lg" severity="secondary" :value="dayjs(counterUser?.dateLastCount)
									.locale('ru')
									.format('DD.MM.YY')
								"></Tag>
						</div>
					</div>
					<div v-if="findNowMonth?.differenceLastWater" class="flex gap-3 items-center mb-3">
						<p>Расход за месяц:</p>
						<div class="">
							<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
							<Tag v-else class="text-lg" severity="secondary"
								:value="findNowMonth?.differenceLastWater + ' куб.м.'">
							</Tag>
						</div>
					</div>
					<div v-if="findNowMonth?.toPay" class="flex gap-3 items-center mb-3">
						<p>За потребление:</p>
						<div class="">
							<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
							<Tag v-else class="text-lg" severity="secondary" :value="findNowMonth?.toPay + ' руб.'"></Tag>
						</div>
					</div>
				</div>
			</div>
			<div v-if="!pending" >
				<div v-if="!isNowMonth" >
					<div class="mt-5 mb-5 flex items-center gap-x-4">
						<h4 class="flex-none font-semibold leading-6 text-indigo-600">
							Передать показания
						</h4>
						<div class="h-px flex-auto bg-gray-100"></div>
					</div>
					<div class="flex  gap-3 mt-3">
						<div >
							<InputNumber  v-model="readings" inputId="withoutgrouping"
							:placeholder="counterUser?.lastCount.toString() || 'Текущие'" :min="0" :useGrouping="false" />
						</div>
						<Button @click="sendData" :disabled="pending" label="Передать"  :loading="isLoad"/>
					</div>
					<div class="mt-3">
        <InlineMessage  v-if="errors.isError" severity="error">{{errors.text }}</InlineMessage>
      </div>
					

				</div>
				<div v-else class="mt-2 mb-5">
					<span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">В этом месяце показания переданы</span>
			
				</div>
			</div>
			<div v-if="difference">
				<Divider />
				<div class="flex gap-3 items-center mb-3">
					<p>Перерасход по общей трубе:</p>
					<div class="">
						<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
						<Tag v-else class="text-lg" severity="secondary" :value="difference + ' куб.м.'"></Tag>
					</div>
				</div>				
				<div class="flex gap-3 items-center mb-3">
					<p>За общий перерасход:</p>
					<div class="">
						<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
						<Tag v-else class="text-lg" severity="secondary" :value="differencePaySingleHouse + ' руб.'"></Tag>
					</div>
				</div>
				<Divider />
			</div>
			<div v-if="expenses">
					<Divider v-if="!difference"/>
					<div class="flex gap-3 items-center mb-3">
						<p>Дополнительные траты:</p>
						<div class="">
							<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
							<Tag v-else class="text-lg" severity="secondary" :value="expenses + ' руб.'"></Tag>
						</div>
					</div>
					<div class="flex gap-3 items-center mb-3">
							<p>Описание:</p>
							<div class="">
								<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
								<p v-else > {{ commentExpenses }}</p>
							</div>
						</div>
					<div class="flex gap-3 items-center mb-3">
						<p>К оплате с дома:</p>
						<div class="">
							<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
							<Tag v-else class="text-lg" severity="secondary" :value="expensesSingleHouse + ' руб.'"></Tag>
						</div>
					</div>
					
					<Divider />
				</div>
			<div class="flex gap-3 items-center mb-3">
				<p>Итого:</p>
				<div class="">
					<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
					<Tag v-else class="text-lg" severity="warn" :value="total + ' руб.'"></Tag>
				</div>
			</div>
			<div class="flex gap-3 items-center mb-3">
				<p>Оплачено:</p>
				<div class="">
					<Skeleton v-if="pending" width="7rem" height="2rem"></Skeleton>
					<Tag v-else class="text-lg" severity="success" :value="totalPay + ' руб.'"></Tag>
				</div>
			</div>
			<div v-if="findNowMonth?.comment" class="flex gap-3 items-center mb-3">
					<p>Комментарий:</p>
					<div class="">
						<p>{{ findNowMonth?.comment }}</p>
					</div>
				</div>

			<div v-if="counterUser?.comment" class="flex gap-3 items-center mb-3">
				<InlineMessage severity="info">{{ counterUser?.comment }}</InlineMessage>
								
				</div>
			

			

			<h3 class="text-2xl mt-12">История показаний</h3>
			<div class="card mt-1" v-if="pending">
				<Skeleton width="100%" height="6rem"></Skeleton>
				<Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
				<Skeleton class="mt-3" width="100%" height="3rem"></Skeleton>
			</div>
			<div v-else class="card mt-1">
				<Accordion :activeIndex="0" multiple>
					<AccordionTab v-for="data in dataMounth" :key="data.datePay"
						:header="dayjs(data.dateCount).locale('ru').format('MMMM') + ' ' + dayjs(data.dateCount).locale('ru').format('YYYY')">
						<p class="m-0">Показания: {{ data.count }} куб.м.</p>
						<p class="m-0">Расход: {{ data.differenceLastWater }} куб.м.</p>
						<p class="m-0">
							Дата: {{ dayjs(data.dateCount).locale('ru').format('DD.MM.YY') }}
						</p>
						<p class="m-0">
							К оплате: {{ data.toPay }} руб. Оплачено: {{ data.pay }} руб.
						</p>
						<p class="m-0">Оплачено за общие нужды: {{ data.payOur }}</p>
						<p class="m-0">{{ data.comment }}</p>
					</AccordionTab>
				</Accordion>
			</div>
		</div>
	</div>
</template>
