<template>
    <div class="fixed inset-0 z-40 flex justify-center items-center gap-5">
        <div
            class="modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-md PRO:mx-4 gap-3 flex flex-col items-center">
            <LogoAnimation />
            <div class="flex gap-1 flex-col w-full">
                <div v-if="login" class="rounded-md items-center flex flex-col relative">
                    <div class="w-full rounded-md h-10 input-color px-4">
                        <input class="z-2 outline-none input-color border-0 box-border h-10 w-full"
                            placeholder="Username or email">
                    </div>
                </div>
                <div v-if="!login" class="rounded-md items-center flex flex-col relative ">
                    <div class="w-full rounded-md h-10 input-color px-4">
                        <input class="z-2 outline-none input-color border-0 box-border h-10 w-full" placeholder="Email">
                    </div>
                </div>
                <div v-if="!login" class="rounded-md this">
                    <div class="w-full rounded-md h-10 input-color px-4">
                        <input class="z-2 outline-none input-color border-0 box-border h-10 w-full" placeholder="Full Name">
                    </div>
                </div>
                <div v-if="!login" class="rounded-md this">
                    <div class="w-full rounded-md h-10 input-color px-4">
                        <input class="z-2 outline-none input-color border-0 box-border h-10 w-full" placeholder="Username">
                    </div>
                </div>
                <div v-if="!login" class="rounded-md this">
                    <div class="w-full rounded-md h-24 input-color px-4">
                        <textarea
                            class="z-2 outline-none input-color border-0 box-border h-24 w-full resize-none focus:ring-0 px-0"
                            placeholder="Bio"></textarea>
                    </div>
                </div>
                <div v-if="!login" class="rounded-md this">
                    <div class="w-full rounded-md h-10 input-color px-4">
                        <input class="z-2 outline-none input-color border-0 box-border h-10 w-full" placeholder="Birthdate">
                    </div>
                </div>
                <div class="rounded-md this">
                    <div class="w-full rounded-md h-10 input-color px-4">
                        <input class="z-2 outline-none input-color border-0 box-border h-10 w-full" placeholder="Password">
                    </div>
                </div>
            </div>
            <button v-if="login" @click="isLoggedIn" class="bg-gray-100 special-text-color rounded-md h-9 w-36">Log
                in</button>
            <button v-if="!login" @click="isLoggedIn" class="bg-gray-100 special-text-color rounded-md h-9 w-36">Sign
                up</button>
            <div class="border-t no-account w-full flex justify-center items-center space-x-2">
                <span v-if="login">Don't have an account?</span>
                <button v-if="login" @click="switchView" class="special-text-color text-lg">Signup</button>
                <span v-if="!login">Have an account?</span>
                <button v-if="!login" @click="switchView" class="special-text-color text-lg">Log in</button>
            </div>
        </div>

    </div>
</template>
<script setup>
import LogoAnimation from "@/components/LogoAnimation.vue";
import { ref } from "vue";


const emit = defineEmits(['LoggedIn'])
function isLoggedIn() {
    emit('LoggedIn')
}
const login = ref(true);
function switchView() {
    login.value = !login.value
}
function LogIn() {
    isLoggedIn()
}
function SignUp() {
    isLoggedIn()
}
</script>
<style>
.special-text-color {
    color: var(--special-text-color);
}

.no-account {
    border-color: var(--color-border);
}

/* 
<div
            class="modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-md PRO:mx-4 gap-3 flex flex-row  justify-center items-center">
            <span v-if="login">Don't have an account?</span>
            <button v-if="login" @click="switchView" class="special-text-color text-lg">Signup</button>
            <span v-if="!login">Have an account?</span>
            <button v-if="!login" @click="switchView" class="special-text-color text-lg">Log in</button>
        </div>
        */
</style>