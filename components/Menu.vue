<script setup lang="ts">
import { items } from "./menu.data";

</script>
<template>
    <div class="container mx-auto">
        <Menubar :model="items" class="px-8 drop-shadow-md">
            <template #start>
                <p class="mr-5">ЛОГО</p>
            </template>
            <template #item="{ item, props, hasSubmenu, root }">
                    <NuxtLink class="flex items-center" :to="item?.link" v-ripple  v-bind="props.action">
                         <span :class="item.icon" class="mr-2"/>
                        {{ item?.label }}
                    </NuxtLink>
            </template>
            <template #end>
                <div class="flex align-items-center gap-2">
                    АВА
                </div>
            </template>
        </Menubar>
    </div>
</template>