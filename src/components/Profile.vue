<template>
  <div
    class="profile w-full flex flex-col gap-2 items-center rounded-lg p-4 border-2"
  >
    <div
      class="w-full h-40 PRO:h-80 flex flex-row PRO:flex-col gap-10 items-center p-2"
    >
      <img
        class="h-full PRO:h-1/2 object-cover aspect-square rounded-full border-2"
        :src="user.profile_picture"
        alt=""
      />
      <div
        class="h-full w-full flex flex-col gap-4 justify-center overflow-x-auto"
      >
        <p
          class="w-full font-bold text-4xl inline overflow-hidden whitespace-nowrap overflow-ellipsis PRO:text-center"
        >
          {{ user.username }}
        </p>
        <p
          class="w-full font-bold text-2xl inline overflow-hidden whitespace-nowrap overflow-ellipsis PRO:text-center"
        >
          {{ user.name }} • {{ user.age }}
        </p>
      </div>
    </div>
    <div
      class="w-full h-20 flex flex-row gap-10 items-center p-2 justify-evenly"
    >
      <p
        class="w-full font-bold text-xl overflow-hidden overflow-ellipsis text-center"
      >
        {{ user.posts.length }} Posts
      </p>
      <p
        class="w-full font-bold text-xl overflow-hidden overflow-ellipsis text-center"
      >
        {{ user.nb_follower }} Followers
      </p>
      <p
        class="w-full font-bold text-xl overflow-hidden overflow-ellipsis text-center"
      >
        {{ user.nb_following }} Following
      </p>
    </div>
    <div
      class="post w-full h-full grid grid-cols-3 PRO:grid-cols-2 gap-10 PRO:gap-6 p-4 border-t-2 pt-10"
    >
      <button
        v-for="post of user.posts"
        @click="console.log('ouverture post ' + post.id)"
        :key="post.id"
      >
        <img
          class="post w-full object-cover aspect-square rounded-lg border-2"
          :src="post.picture"
          alt=""
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import type { User } from "@/api/type";

export default {
  name: "default-profile",
  props: {
    user: {} as User,
  },
};
</script>

<style scoped>
.profile {
  border-color: var(--color-border);
  background-color: var(--color-background);
}

.post {
  border-color: var(--color-border);
}
</style>
