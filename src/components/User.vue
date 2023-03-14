<template>
  <router-link
    to="/profile"
    class="flex flex-row gap-2 items-center rounded-lg p-2 w-fit"
  >
    <img
      class="h-full object-cover aspect-square rounded-full border-2"
      :src="user.profile_picture"
      alt=""
    />
    <p
      v-if="smaller === true"
      class="font-bold text-xl inline overflow-hidden whitespace-nowrap overflow-ellipsis"
    >
      {{ user.username }}
    </p>
    <p
      v-else
      class="w-full font-bold text-2xl inline overflow-hidden whitespace-nowrap overflow-ellipsis"
    >
      {{ user.username }}
    </p>
  </router-link>
</template>

<script lang="ts">
import type { User } from "@/api/type";

export default {
  name: "default-user",
  props: {
    user: {} as User,
    smaller: Boolean,
  },
};
</script>

<style scoped></style>
