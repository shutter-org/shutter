import { defineStore } from "pinia";
import { ref } from "vue"

export const useUserStore = defineStore('user', () => {
  const username = ref("");
  const authKey = ref("");
  const setUsername = (usernameProp: string) => {
    username.value = usernameProp;
  };
  const setAuthKey = (authKeyProp: string) => {
    authKey.value = authKeyProp;
  };

  return { username, authKey, setUsername, setAuthKey }
})
