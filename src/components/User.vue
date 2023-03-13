<template>
  <router-link
    to="/profile"
    class="flex flex-row gap-2 items-center rounded-lg p-2 w-fit"
  >
    <img
      class="h-full object-cover aspect-square rounded-full border-2"
      :src="profile_picture"
      alt=""
    />
    <p
      v-if="smaller === true"
      class="font-bold text-xl inline overflow-hidden whitespace-nowrap overflow-ellipsis"
    >
      {{ username }}
    </p>
    <p
      v-else
      class="w-full font-bold text-2xl inline overflow-hidden whitespace-nowrap overflow-ellipsis"
    >
      {{ username }}
    </p>
  </router-link>
</template>

<script>
export default {
  name: "default-user",
  props: {
    profile_picture: String,
    username: String,
    smaller: Boolean,
  },
};
</script>

<style scoped></style>
