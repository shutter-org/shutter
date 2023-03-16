<template>
  <router-link to="/profile" class="flex flex-row gap-2 items-center rounded-lg p-2 w-fit">
    <img class="h-full object-cover aspect-square rounded-full border-2" :src="props.user.profile_picture" alt="" />
    <p v-if="props.smaller === true" class="font-bold text-xl inline overflow-hidden whitespace-nowrap overflow-ellipsis">
      {{ props.user.username }}
    </p>
    <p v-else class="w-full font-bold text-2xl inline overflow-hidden whitespace-nowrap overflow-ellipsis">
      {{ props.user.username }}
    </p>
  </router-link>
</template>

<script setup lang="ts">
import type { SimplifiedUser } from "@/api/type";
import type { PropType } from "vue";

const props = defineProps({
  user: {
    type: Object as PropType<SimplifiedUser>,
    required: true
  },
  smaller: Boolean,
});
</script>

<style scoped></style>
