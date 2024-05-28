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
        <a v-ripple class="flex items-end" v-bind="props.action">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>           
        </a>
    </template>
    <template #end>
        <div class="flex align-items-center gap-2">        
         АВА
        </div>
    </template>
</Menubar>
</div>

</template>