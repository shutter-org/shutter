<template>
  <div class="flex flex-row gap-2">
    <button>
      <UpvoteIcon v-if="rate !== 1" @click="voteUp" />
      <FilledUpvoteIcon v-else @click="voteUp" />
    </button>
    <p class="font-bold text-xl">{{ this.total }}</p>
    <button>
      <DownvoteIcon v-if="rate !== -1" @click="voteDown" />
      <FilledDownvoteIcon v-else @click="voteDown" />
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
  data: function () {
    return {
      rate: this.user_rate,
      total: this.total_rate,
    };
  },
  methods: {
    voteUp() {
      this.total -= this.rate;
      if (this.rate === 1) {
        this.rate = 0;
      } else {
        this.rate = 1;
      }
      this.total += this.rate;
    },
    voteDown() {
      this.total -= this.rate;
      if (this.rate === -1) {
        this.rate = 0;
      } else {
        this.rate = -1;
      }
      this.total += this.rate;
    },
  },
};
</script>

<style scoped></style>
