import { defineStore } from "pinia";
import { ref, watch } from "vue"
import { getMoreUserFollows, getMoreUserPublications, getUser } from "@/api/user";
import { followUser, unfollowUser, deleteUser } from "@/api/user";
import type { SimplifiedPublication, SimplifiedUser, User } from "@/api/type";

export const useUserStore = defineStore('user', () => {
  const username = ref("");
  const profile_picture = ref("");
  const authKey = ref("");
  const sessionStartDate = ref(Number.NaN);
  const lastShownUsers = ref(new Map<String, User>());
  const isBusy = ref(false);

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
  async function deleteCurrentUser() {
    const res = await deleteUser(username.value, authKey.value);
  }

  const getShownUser = (username: string) => {
    return lastShownUsers.value.get(username.toLowerCase());
  }
  const removeShownUser = (username: string) => {
    lastShownUsers.value.delete(username);
  }
  async function loadShownUser(username: string) {
    isBusy.value = true;
    const res = await getUser(username, authKey.value);
    if (res.status === 200) {
      const shownUser = await res.json() as User;
      lastShownUsers.value.set(shownUser.username.toLowerCase(), shownUser);
      isBusy.value = false;
      return shownUser;
    }
    isBusy.value = false;
    return undefined;
  };
  async function loadMorePublications(username: string, page: number) {
    const res = await getMoreUserPublications(username, page, authKey.value);
    if (res.status === 200) {
      const publications = await res.json() as SimplifiedPublication[];
      lastShownUsers.value.get(username.toLowerCase())!.publications = lastShownUsers.value.get(username.toLowerCase())!.publications.concat(publications);
    }
  }
  async function loadMoreFollows(username: string, follows: string, page: number) {
    const res = await getMoreUserFollows(username, follows, page, authKey.value);
    if (res.status === 200) {
      const users = await res.json() as SimplifiedUser[];
      if (follows === "followers") {
        lastShownUsers.value.get(username.toLowerCase())!.followers = lastShownUsers.value.get(username.toLowerCase())!.followers.concat(users);
      }
      else {
        lastShownUsers.value.get(username.toLowerCase())!.following = lastShownUsers.value.get(username.toLowerCase())!.following.concat(users);
      }
    }
  }

  async function follow(usernameProp: string) {
    if (!isBusy.value) {
      isBusy.value = true;
      const res = await followUser(usernameProp, authKey.value);
      if (res.status === 200) {
        let user = lastShownUsers.value.get(usernameProp.toLowerCase());
        if (user !== undefined) {
          user.followed_by_user = true;
          user.nb_followers += 1;
          user.followers.push(getSimplifiedUser());
        }
      }
      isBusy.value = false;
    }
  }
  async function unfollow(usernameProp: string) {
    if (!isBusy.value) {
      isBusy.value = true;
      const res = await unfollowUser(usernameProp, authKey.value);
      if (res.status === 200) {
        let user = lastShownUsers.value.get(usernameProp.toLowerCase());
        if (user !== undefined) {
          user.followed_by_user = false;
          user.nb_followers -= 1;
          user.followers = user.followers.filter((user: SimplifiedUser) => {
            return user.username !== username.value;
          });
        }
      }
      isBusy.value = false;
    }
  }

  const reset = () => {
    username.value = "";
    profile_picture.value = "";
    authKey.value = "";
    sessionStartDate.value = Number.NaN;
    lastShownUsers.value = new Map();
  }

  return {
    username, profile_picture, authKey, sessionStartDate, deleteCurrentUser,
    setUsername, setProfilePicture, setAuthKey, startSession, getSimplifiedUser, reset,
    getShownUser, removeShownUser, loadShownUser, loadMorePublications, loadMoreFollows, follow, unfollow
  }
})

