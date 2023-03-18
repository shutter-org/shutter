import { defineStore } from "pinia";
import { ref, watch } from "vue"
import type { SimplifiedUser } from "@/api/type";

export const useUserStore = defineStore('user', () => {
  const username = ref("");
  const profile_picture = ref("");
  const authKey = ref("");
  const sessionStartDate = ref(Number.NaN);

  if (sessionStorage.getItem("username")) {
    username.value = JSON.parse(sessionStorage.getItem("username") as string);
  }
  if (sessionStorage.getItem("profile_picture")) {
    profile_picture.value = JSON.parse(sessionStorage.getItem("profile_picture") as string);
  }
  if (sessionStorage.getItem("authKey")) {
    authKey.value = JSON.parse(sessionStorage.getItem("authKey") as string);
  }
  if (sessionStorage.getItem("sessionDuration")) {
    sessionStartDate.value = JSON.parse(sessionStorage.getItem("sessionDuration") as string);
  }

  watch(
    username, (usernameVal) => {
      sessionStorage.setItem("username", JSON.stringify(usernameVal));
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
  watch(
    sessionStartDate, (sessionDuration) => {
      sessionStorage.setItem("sessionDuration", JSON.stringify(sessionDuration));
    }, { deep: true }
  );

  const setUsername = (usernameProp: string) => {
    username.value = usernameProp;
  };
  const setProfilePicture = (profilePictureProp: string) => {
    profile_picture.value = profilePictureProp;
  };
  const setAuthKey = (authKeyProp: string) => {
    authKey.value = authKeyProp;
  };
  const startSession = () => {
    sessionStartDate.value = Date.now();
  }
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
    sessionStartDate.value = Number.NaN;
  }

  return { username, profile_picture, authKey, sessionStartDate, setUsername, setProfilePicture, setAuthKey, startSession, getUser, reset }
})

