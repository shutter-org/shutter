<template>
    <div class="p-10 max-w-5xl ml-auto mr-auto flex flex-col">
        <div class="mb-10 w-64 rounded-md h-12 input-color pl-4 self-center flex-row flex items-center">
            <input class="z-2 outline-none input-color border-0 box-border w-full h-12  rounded-md" v-focus
                placeholder="Search..." />
            <CrossIcon class="h-6 pr-2" />
        </div>
        <div class="flex flex-wrap justify-center gap-1">
            <div class="w-60 h-52 bg-gray-100" v-for="index in 10" :key="index"></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import CrossIcon from "@/components/icons/CrossIcon.vue";
</script>
<style></style>