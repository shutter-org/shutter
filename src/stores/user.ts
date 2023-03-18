import { defineStore } from "pinia";
import { ref, watch } from "vue"
import type { SimplifiedUser } from "@/api/type";

export const useUserStore = defineStore('user', () => {
  const username = ref("");
  const password = ref("");
  const profile_picture = ref("");
  const authKey = ref("");

  if (sessionStorage.getItem("username")) {
    username.value = JSON.parse(sessionStorage.getItem("username") as string);
  }
  if (sessionStorage.getItem("password")) {
    password.value = JSON.parse(sessionStorage.getItem("password") as string);
  }
  if (sessionStorage.getItem("profile_picture")) {
    profile_picture.value = JSON.parse(sessionStorage.getItem("profile_picture") as string);
  }
  if (sessionStorage.getItem("authKey")) {
    authKey.value = JSON.parse(sessionStorage.getItem("authKey") as string);
  }

  watch(
    username, (usernameVal) => {
      sessionStorage.setItem("username", JSON.stringify(usernameVal));
    }, { deep: true }
  );
  watch(
    password, (passwordVal) => {
      sessionStorage.setItem("password", JSON.stringify(passwordVal));
    }, { deep: true }
  );
  watch(
    profile_picture, (profile_pictureVal) => {
      sessionStorage.setItem("profile_picture", JSON.stringify(profile_pictureVal));
    }, { deep: true }
  );
  watch(
    authKey, (authKeyVal) => {
      sessionStorage.setItem("authKey", JSON.stringify(authKeyVal));
    }, { deep: true }
  );

  const setUsername = (usernameProp: string) => {
    username.value = usernameProp;
  };
  const setPassword = (passwordProp: string) => {
    password.value = passwordProp;
  };
  const setProfilePicture = (profilePictureProp: string) => {
    profile_picture.value = profilePictureProp;
  };
  const setAuthKey = (authKeyProp: string) => {
    authKey.value = authKeyProp;
  };
  const getUser = () => {
    return {
      "username": username.value,
      "profile_picture": profile_picture.value
    } as SimplifiedUser;
  }
  const reset = () => {
    username.value = "";
    profile_picture.value = "";
    authKey.value = "";
  }

  return { username, password, profile_picture, authKey, setUsername, setPassword, setProfilePicture, setAuthKey, getUser, reset }
})

