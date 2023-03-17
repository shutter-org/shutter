import { defineStore } from "pinia";
import { ref } from "vue"

export const useUserStore = defineStore('user', () => {
  const username = ref("");
  const profile_picture = ref("");
  const authKey = ref("");

  const setUsername = (usernameProp: string) => {
    username.value = usernameProp;
  };
  const setProfilePicture = (profilePictureProp: string) => {
    profile_picture.value = profilePictureProp;
  };
  const setAuthKey = (authKeyProp: string) => {
    authKey.value = authKeyProp;
  };
  const reset = () => {
    username.value = "";
    profile_picture.value = "";
    authKey.value = "";
  }

  return { username, profile_picture, authKey, setUsername, setProfilePicture, setAuthKey, reset }
})
