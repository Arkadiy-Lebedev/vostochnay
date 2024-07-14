<script setup lang="ts">
import { items } from "./menu.data";
import Menu from 'primevue/menu'
import { useUserStore } from '../stores/user.store'
const { userInfo } = useUserStore()

const tokenCookie = useCookie('tokenUser')

const menu = ref()
const items2 = ref([
    {
        label: 'Настройки',
        icon: 'pi pi-cog',
       
    },
    {
        label: 'Выйти',
        icon: 'pi pi-sign-out',
        command: () => {
           logOut()
        }

    }
]);

const toggle = (event: MouseEvent) => {
    menu.value.toggle(event)
};

const logOut = () => {
    tokenCookie.value = null;
    navigateTo('/login')

}

</script>
<template>
    <div class="container mx-auto">
        <Menubar :model="items" class="px-8 drop-shadow-md">
            <template #start>
                <p class="mr-5">ЛОГО</p>
            </template>
            <template #item="{ item, props, hasSubmenu, root }">
                    <NuxtLink v-if="item.role == userInfo.role || item.role == 'all'" class="flex items-center" :to="item?.link" v-ripple  v-bind="props.action">
                         <span :class="item.icon" class="mr-2"/>
                        {{ item?.label }}
                    </NuxtLink>
            </template>
            <template #end>
               
                <div @click="toggle" class="flex align-items-center gap-2"> 
                    <p class="underline cursor-pointer">{{ userInfo.family }} {{ userInfo.name.charAt(0) }}.{{ userInfo.surname.charAt(0) }}.</p>                              
                   <Menu ref="menu" id="overlay_menu" :model="items2" :popup="true" />
                </div>
            </template>
        </Menubar>

    </div>
</template>