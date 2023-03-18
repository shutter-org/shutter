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
        <div v-if="!login" class="rounded-md this">
          <div class="w-full rounded-md h-10 input-color px-4">
            <input type="date" name="birthday" class="z-2 outline-none input-color border-0 box-border h-10 w-full"
              placeholder="Birthdate" v-model="birthdate" />
          </div>
        </div>
        <div class="rounded-md items-center flex flex-col relative">
          <div class="w-full rounded-md h-10 input-color px-4">
            <input class="z-2 outline-none input-color border-0 box-border h-10 w-full" placeholder="Username"
              v-model="username" />
          </div>
        </div>
        <div class="rounded-md this">
          <div class="w-full rounded-md h-10 input-color px-4">
            <input class="z-2 outline-none input-color border-0 box-border h-10 w-full hidePassword"
              placeholder="Password" v-model="password" />
          </div>
        </div>
        <div v-if="!login" class="rounded-md this">
          <div class="w-full rounded-md h-10 input-color px-4">
            <input class="z-2 outline-none input-color border-0 box-border h-10 w-full hidePassword"
              placeholder="Confirm password" v-model="passwordConfirmation" />
          </div>
        </div>
      </div>
      <button v-if="login" @click="SignIn" class="bg-gray-100 special-text-color rounded-md h-9 w-36">
        Log in
      </button>
      <button v-if="!login" @click="SignUp" class="bg-gray-100 special-text-color rounded-md h-9 w-36">
        Sign up
      </button>
      <div class="border-t shutter-border-color w-full flex justify-center items-center space-x-2">
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
import type { SignInUser, SignUpUser } from "@/api/auth";
import { signIn, signUp } from "@/api/auth";
import { ref } from "vue";
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();
const email = ref("");
const username = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const name = ref("");
const bio = ref("");
const birthdate = ref("");
const login = ref(true);

const emit = defineEmits(["LoggedIn"]);

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
  const returningUser: SignInUser = {
    username: username.value,
    password: password.value,
  };

  const res = await signIn(returningUser)
  if (res.status !== 200) {
    console.log("erreur dans le username ou mdp");
  }
  else {
    const data = await res.json();
    userStore.setUsername(data.user.username);
    userStore.setProfilePicture(data.user.profile_picture);
    userStore.setAuthKey(data.acces_token);
    emit("LoggedIn");
  }
}
async function SignUp() {
  if (password.value === passwordConfirmation.value) {
    if (!!username.value && !!password.value && !!email.value && !!name.value && !!birthdate.value) {
      const newUser: SignUpUser = {
        username: username.value,
        password: password.value,
        email: email.value,
        name: name.value,
        birthdate: birthdate.value.replace(/-/g, '/'),
      };

      const res = await signUp(newUser)
      if (res.status !== 201) {
        console.log("erreur dans la creation du user");
      }
      else {
        const data = await res.json();
        userStore.setUsername(username.value);
        userStore.setAuthKey(data.acces_token);
        console.log("account created");
        switchView();
      }
    }
    else {
      console.log("champs vide");
    }
  }
  else {
    console.log("mdp diff");
  }
}
</script>
<style>
.special-text-color {
  color: var(--special-text-color);
}

.hidePassword {
  -webkit-text-security: disc;
}

input[type="date"] {
  background: transparent;
  color: var(--color-text);
  padding-left: 0px;
}

input[type="date"]:focus {
  box-shadow: none;
}
</style>
