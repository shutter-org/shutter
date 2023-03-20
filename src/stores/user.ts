import { defineStore } from "pinia";
import { ref, watch } from "vue"
import { getUser } from "@/api/user";
import { followUser, unfollowUser } from "@/api/user";
import type { SimplifiedUser, User } from "@/api/type";

export const useUserStore = defineStore('user', () => {
  const username = ref("");
  const profile_picture = ref("");
  const authKey = ref("");
  const sessionStartDate = ref(Number.NaN);

  const lastShownUsers = ref([] as User[]);

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
  const getSimplifiedUser = () => {
    return {
      "username": username.value,
      "profile_picture": profile_picture.value
    } as SimplifiedUser;
  }

  const getShownUser = (username: string) => {
    for (let user of lastShownUsers.value) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }
  async function loadShownUser(username: string) {
    const res = await getUser(username, authKey.value);
    if (res.status === 200) {
      const shownUser = await res.json();
      lastShownUsers.value.push(shownUser);
      return shownUser;
    }
    return undefined;
  };
  async function updateUser() {
    const res = await getUser(username.value, authKey.value);
    if (res.status === 200) {
      const shownUser = await res.json();
      const index = lastShownUsers.value.findIndex((user: User) => user.username === username.value);
      lastShownUsers.value[index] = shownUser;
    }
  };
  async function follow(usernameProp: string) {
    const res = await followUser(usernameProp, authKey.value);
    if (res.status === 200) {
      const index = lastShownUsers.value.findIndex((user: User) => user.username === usernameProp);
      lastShownUsers.value[index].followed_by_user = true;
      lastShownUsers.value[index].followers.push(getSimplifiedUser());
    }
  }
  async function unfollow(usernameProp: string) {
    const res = await unfollowUser(usernameProp, authKey.value);
    if (res.status === 200) {
      const index = lastShownUsers.value.findIndex((user: User) => user.username === usernameProp);
      lastShownUsers.value[index].followed_by_user = false;
      lastShownUsers.value[index].followers = lastShownUsers.value[index].followers.filter((user: SimplifiedUser) => {
        return user.username !== username.value;
      });
    }
  }

  const reset = () => {
    username.value = "";
    profile_picture.value = "";
    authKey.value = "";
    sessionStartDate.value = Number.NaN;
    lastShownUsers.value = [];
  }

  return {
    username, profile_picture, authKey, sessionStartDate,
    setUsername, setProfilePicture, setAuthKey, startSession, getSimplifiedUser, reset,
    getShownUser, loadShownUser, updateUser, follow, unfollow
  }
})

