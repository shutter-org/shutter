<template>
  <div class="flex flex-row gap-2">
    <button>
      <UpvoteIcon v-if="user_rate !== 1" @click="this.$emit('voteUp')" />
      <FilledUpvoteIcon v-else @click="this.$emit('voteUp')" />
    </button>
    <p class="font-bold text-xl">{{ total_rate }}</p>
    <button>
      <DownvoteIcon v-if="user_rate !== -1" @click="this.$emit('voteDown')" />
      <FilledDownvoteIcon v-else @click="this.$emit('voteDown')" />
    </button>
  </div>
</template>

<script>
import UpvoteIcon from "@/components/icons/UpvoteIcon.vue";
import DownvoteIcon from "@/components/icons/DownvoteIcon.vue";
import FilledUpvoteIcon from "@/components/icons/filledUpvoteIcon.vue";
import FilledDownvoteIcon from "@/components/icons/filledDownvoteIcon.vue";

export default {
  name: "RatingInterface",
  components: {
    FilledDownvoteIcon,
    FilledUpvoteIcon,
    DownvoteIcon,
    UpvoteIcon,
  },
  props: {
    total_rate: Number,
    user_rate: Number,
  },
};
</script>

<style scoped></style>
