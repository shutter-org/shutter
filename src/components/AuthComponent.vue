<template>
  <div class="fixed inset-0 z-40 flex justify-center items-center gap-5">
    <div
      class="shutter-modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-md PRO:mx-4 gap-3 flex flex-col items-center">
      <LogoAnimation />
      <p v-if="errorMessage !== ''" class="text-lg inline h-7 items-center text-red-500">{{ errorMessage }}</p>
      <p v-else class="text-lg inline h-7 items-center text-green-400">{{ message }}</p>
      <div class="flex gap-2 flex-col w-full">

        <!-- Email -->
        <div v-if="!login" class="rounded-md items-center flex flex-col relative">
          <div class="w-full rounded-md h-10 shutter-background-color px-4">
            <input class="z-2 outline-none shutter-background-color border-0 box-border h-10 w-full" placeholder="Email"
              v-model="email" @keydown.enter.prevent="onPressEnter" />
          </div>
        </div>

        <!-- Name -->
        <div v-if="!login" class="rounded-md this">
          <div class="w-full rounded-md h-10 shutter-background-color px-4">
            <input class="z-2 outline-none shutter-background-color border-0 box-border h-10 w-full"
              placeholder="Full Name" v-model="name" @keydown.enter.prevent="onPressEnter" />
          </div>
        </div>

        <!-- Birthdate -->
        <div v-if="!login" class="rounded-md this">
          <div class="w-full rounded-md h-10 shutter-background-color px-4">
            <input type="date" name="birthday"
              class="z-2 outline-none shutter-background-color border-0 box-border h-10 w-full" placeholder="Birthdate"
              v-model="birthdate" @keydown.enter.prevent="onPressEnter" />
          </div>
        </div>

        <!-- Username -->
        <div class="rounded-md items-center flex flex-col relative">
          <div class="w-full rounded-md h-10 shutter-background-color px-4">
            <input class="z-2 outline-none shutter-background-color border-0 box-border h-10 w-full"
              placeholder="Username" v-model="username" @keydown.enter.prevent="onPressEnter" name="username"
              autocomplete="on" />
          </div>
        </div>

        <!-- Password -->
        <div class="rounded-md this">
          <div class="w-full rounded-md h-10 shutter-background-color px-4">
            <input class="z-2 outline-none shutter-background-color border-0 box-border h-10 w-full hidePassword"
              placeholder="Password" v-model="password" @keydown.enter.prevent="onPressEnter" name="password"
              autocomplete="on" />
          </div>
        </div>

        <!-- Confirm password -->
        <div v-if="!login" class="rounded-md this">
          <div class="w-full rounded-md h-10 shutter-background-color px-4">
            <input class="z-2 outline-none shutter-background-color border-0 box-border h-10 w-full hidePassword"
              placeholder="Confirm password" v-model="passwordConfirmation" @keydown.enter.prevent="onPressEnter" />
          </div>
        </div>
      </div>

      <!-- Login button -->
      <button v-if="login" @click="SignIn" class="hover:bg-[#e7e7e7] bg-gray-100 tags font-bold rounded-md h-9 w-36 mt-4">
        Log in
      </button>

      <!-- Sign up button -->
      <button v-if="!login" @click="SignUp"
        class="hover:bg-[#e7e7e7] bg-gray-100 tags font-bold rounded-md h-9 w-36 mt-4">
        Sign up
      </button>

      <!-- Switch to login/signup -->
      <div class="border-t shutter-border-color w-full flex justify-center items-center space-x-2 pt-2">
        <span v-if="login">Don't have an account?</span>
        <button v-if="login" @click="switchView" class="tags text-lg">
          Signup
        </button>
        <span v-if="!login">Have an account?</span>
        <button v-if="!login" @click="switchView" class="tags text-lg">
          Log in
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import LogoAnimation from "@/components/LogoAnimation.vue";
import { signIn, signUp, encryptWithAES } from "@/api/auth";
import { ref } from "vue";
import { useUserStore } from '@/stores/user'
import type { SignInUser, SignUpUser } from "@/api/auth";

const userStore = useUserStore();
const email = ref("");
const username = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const name = ref("");
const bio = ref("");
const birthdate = ref("");
const login = ref(true);
const errorMessage = ref("");
const message = ref("");

const emit = defineEmits(["LoggedIn"]);

function switchView() {
  email.value = "";
  username.value = "";
  password.value = "";
  name.value = "";
  bio.value = "";
  birthdate.value = "";
  passwordConfirmation.value = "";

  login.value = !login.value;
}
function onPressEnter() {
  if (login.value) {
    SignIn();
  } else {
    SignUp();
  }
}
async function SignIn() {
  const returningUser: SignInUser = {
    username: username.value,
    password: encryptWithAES(password.value),
  };

  const res = await signIn(returningUser)
  if (res.status !== 200) {
    errorMessage.value = "Incorrect username or password";
    setTimeout(() => errorMessage.value = "", 3000);

  }
  else {
    const data = await res.json();
    userStore.setUsername(data.user.username);
    userStore.setProfilePicture(data.user.profile_picture);
    userStore.setAuthKey(data.access_token);
    emit("LoggedIn");
  }
}
async function SignUp() {
  if (password.value === passwordConfirmation.value) {
    if (!!username.value && !!password.value && !!email.value && !!name.value && !!birthdate.value) {
      username.value = username.value.trim();
      if (!/\s/.test(username.value)) {
        const newUser: SignUpUser = {
          username: username.value,
          password: encryptWithAES(password.value),
          email: email.value,
          name: name.value,
          birthdate: birthdate.value.replace(/-/g, '/'),
        };

        const res = await signUp(newUser)
        if (res.status !== 201) {
          const data = await res.json();
          errorMessage.value = data.Error;
          setTimeout(() => errorMessage.value = "", 3000);
        }
        else {
          const data = await res.json();
          userStore.setUsername(username.value);
          userStore.setAuthKey(data.access_token);

          message.value = "Account created with success";
          setTimeout(() => {
            message.value = "";
          }, 3000);

          switchView();
        }
      }
      else {
        errorMessage.value = "Username must not contain white spaces";
        setTimeout(() => errorMessage.value = "", 3000);
      }
    }
    else {
      errorMessage.value = "Empty fields";
      setTimeout(() => errorMessage.value = "", 3000);
    }
  }
  else {
    errorMessage.value = "Passswords are not the same";
    setTimeout(() => errorMessage.value = "", 3000);
  }
}
</script>
<style scoped>
.hidePassword {
  -webkit-text-security: disc;
}

input:-webkit-autofill,
input:-webkit-autofill:focus {
  transition: background-color 600000s 0s, color 600000s 0s;
}

input[data-autocompleted] {
  background-color: transparent !important;
}
</style>