import { defineStore } from "pinia";
import { ref, watch } from "vue"

export const useUserStore = defineStore('user', () => {
  const username = ref("");
  const password = ref("");
  const profile_picture = ref("");
  const authKey = ref("");

  if (localStorage.getItem("username")) {
    username.value = JSON.parse(localStorage.getItem("username") as string);
  }
  if (localStorage.getItem("password")) {
    password.value = JSON.parse(localStorage.getItem("password") as string);
  }
  if (localStorage.getItem("profile_picture")) {
    profile_picture.value = JSON.parse(localStorage.getItem("profile_picture") as string);
  }
  if (localStorage.getItem("authKey")) {
    authKey.value = JSON.parse(localStorage.getItem("authKey") as string);
  }

  watch(
    username, (usernameVal) => {
      localStorage.setItem("username", JSON.stringify(usernameVal));
    }, { deep: true }
  );
  watch(
    password, (passwordVal) => {
      localStorage.setItem("password", JSON.stringify(passwordVal));
    }, { deep: true }
  );
  watch(
    profile_picture, (profile_pictureVal) => {
      localStorage.setItem("profile_picture", JSON.stringify(profile_pictureVal));
    }, { deep: true }
  );
  watch(
    authKey, (authKeyVal) => {
      localStorage.setItem("authKey", JSON.stringify(authKeyVal));
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
    };
  }
  const reset = () => {
    username.value = "";
    profile_picture.value = "";
    authKey.value = "";
  }

  return { username, password, profile_picture, authKey, setUsername, setPassword, setProfilePicture, setAuthKey, getUser, reset }
})

