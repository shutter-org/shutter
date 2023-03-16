<template>
  <div class="fixed inset-0 z-40 flex justify-center items-center gap-5">
    <div
      class="modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-md PRO:mx-4 gap-3 flex flex-col items-center">
      <LogoAnimation />
      <div class="flex gap-1 flex-col w-full">
        <div v-if="!login" class="rounded-md items-center flex flex-col relative">
          <div class="w-full rounded-md h-10 input-color px-4">
            <input class="z-2 outline-none input-color border-0 box-border h-10 w-full" placeholder="Email"
              v-model="email" />
          </div>
        </div>
        <div v-if="!login" class="rounded-md this">
          <div class="w-full rounded-md h-10 input-color px-4">
            <input class="z-2 outline-none input-color border-0 box-border h-10 w-full" placeholder="Full Name"
              v-model="name" />
          </div>
        </div>
        <div class="rounded-md items-center flex flex-col relative">
          <div class="w-full rounded-md h-10 input-color px-4">
            <input class="z-2 outline-none input-color border-0 box-border h-10 w-full" placeholder="Username"
              v-model="username" />
          </div>
        </div>
        <div v-if="!login" class="rounded-md this">
          <div class="w-full rounded-md h-10 input-color px-4">
            <input class="z-2 outline-none input-color border-0 box-border h-10 w-full" placeholder="Birthdate"
              v-model="birthdate" />
          </div>
        </div>
        <div class="rounded-md this">
          <div class="w-full rounded-md h-10 input-color px-4">
            <input class="z-2 outline-none input-color border-0 box-border h-10 w-full hidePassword"
              placeholder="Password" v-model="password" />
          </div>
        </div>
      </div>
      <button v-if="login" @click="SignIn" class="bg-gray-100 special-text-color rounded-md h-9 w-36">
        Log in
      </button>
      <button v-if="!login" @click="SignUp" class="bg-gray-100 special-text-color rounded-md h-9 w-36">
        Sign up
      </button>
      <div class="border-t no-account w-full flex justify-center items-center space-x-2">
        <span v-if="login">Don't have an account?</span>
        <button v-if="login" @click="switchView" class="special-text-color text-lg">
          Signup
        </button>
        <span v-if="!login">Have an account?</span>
        <button v-if="!login" @click="switchView" class="special-text-color text-lg">
          Log in
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import LogoAnimation from "@/components/LogoAnimation.vue";
import type { SignInUser } from "@/api/auth";
import { SignInAPI } from "@/api/auth";
import { ref } from "vue";

const email = ref("");
const username = ref("");
const password = ref("");
const name = ref("");
const bio = ref("");
const birthdate = ref("");

const emit = defineEmits(["LoggedIn"]);

const login = ref(true);

function isLoggedIn() {
  emit("LoggedIn");
}

function switchView() {
  email.value = "";
  username.value = "";
  password.value = "";
  name.value = "";
  bio.value = "";
  birthdate.value = "";

  login.value = !login.value;
}
async function SignIn() {
  const newUser: SignInUser = {
    username: username.value,
    password: password.value,
  };

  await SignInAPI(newUser).then((res) => {
    if (res.status == 200) {
      //get user
      //add it to store
      //if status == 200
      //emit logged in
      isLoggedIn();
    }
    if (res.status == 400) {
      //afficher message derreur
    }
  });
  isLoggedIn();
}
function SignUp() {
  isLoggedIn();
}
</script>
<style>
.special-text-color {
  color: var(--special-text-color);
}

.no-account {
  border-color: var(--color-border);
}

.hidePassword {
  -webkit-text-security: disc;
}
</style>
