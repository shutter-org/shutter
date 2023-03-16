<template>
  <div class="flex flex-row gap-2">
    <button>
      <UpvoteIcon v-if="props.user_rate !== 1" @click="emit('voteUp')" />
      <FilledUpvoteIcon v-else @click="emit('voteUp')" />
    </button>
    <p class="font-bold text-xl">{{ props.total_rate }}</p>
    <button>
      <DownvoteIcon v-if="props.user_rate !== -1" @click="emit('voteDown')" />
      <FilledDownvoteIcon v-else @click="emit('voteDown')" />
    </button>
  </div>
</template>

<script setup>
import UpvoteIcon from "@/components/icons/UpvoteIcon.vue";
import DownvoteIcon from "@/components/icons/DownvoteIcon.vue";
import FilledUpvoteIcon from "@/components/icons/filledUpvoteIcon.vue";
import FilledDownvoteIcon from "@/components/icons/filledDownvoteIcon.vue";

const props = defineProps({
  total_rate: Number,
  user_rate: Number,
});

const emit = defineEmits(["voteUp", "voteDown"]);
</script>

