<template>
    <div class="flex justify-center items-center h-screen flex-col gap-y-2">
        <div
            class="authentification-background rounded-md flex flex-col items-center w-[640px] PRO:max-w-[640px] PRO:mx-4 mx-auto max-w-full relative">
            <LogoAnimation />
            <a href="#" @click="LoggedIn">Sign up</a>
        </div>
        <div
            class="authentification-background rounded-md w-[640px] PRO:max-w-[640px] PRO:mx-4 mx-auto max-w-full relative">
            <a href="#" @click="LoggedIn">Sign up</a>
        </div>
    </div>
</template>
<script setup>
import LogoAnimation from "@/components/LogoAnimation.vue";

const emit = defineEmits(['LoggedIn'])
function LoggedIn() {
    emit('LoggedIn')
}
</script>
<style scoped>
.authentification-background {
    background-color: var(--modal-color);
}
</style>