import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const biography = ref("");
  const birthdate = ref("");
  const email = ref("");
  const name = ref("");
  const username = ref("");
  const created_date = ref("");
  const profile_picture = ref("");
  const followers = ref([]);
  const following = ref([]);

  return { biography };
});
