<template>
  <div class="fixed inset-0 z-40 flex justify-center items-center">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')"></div>
    <div
      class="post flex flex-col gap-4 items-center rounded-lg p-4 relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
      <div class="flex flex-row items-center justify-between w-full">
        <User class="h-14 mr-auto" :user="props.user"></User>
      </div>
      <button @click="openUploadForm"
        class="inputable w-full aspect-square object-cover rounded-lg grid grid-cols-1 grid-rows-1 justify-center items-center border-2">
        <ImgLoader id="picture" v-if="isPictureUploaded" :src="picture_url" alt=""
          class="w-full aspect-square object-cover rounded-lg stack" />
        <div id="svg" class="w-full aspect-square stack z-50 rounded-lg flex justify-center">
          <ImageIcon class="w-1/2 aspect-square inputableImage"></ImageIcon>
        </div>
      </button>
      <input class="hidden" type="file" id="imgInput" name="img" accept="image/*" @change="loadPicture" />
      <textarea class="inputable desc h-36 w-full text-xl p-2 border-2 rounded-lg" placeholder="Description..."
        maxlength="200" v-model="desc" />
      <textarea class="inputable tags h-32 w-full text-xl p-2 border-2 rounded-lg" placeholder="Tags..." maxlength="160"
        v-model="tags" />
      <button @click="post" class="postButton text-xl p-2 rounded-lg pr-10 pl-10">
        Post
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import User from "@/components/UserComponent.vue";
import ImageIcon from "@/components/icons/ImageIcon.vue";
import ImgLoader from "../ImgLoader.vue";
import { createPublication } from "@/api/publication";
import { ref } from "vue";
import { useUserStore } from '@/stores/user'
import type { PropType } from "vue";
import type { SimplifiedPublication, SimplifiedUser as UserType } from "@/api/type";

const props = defineProps({
  user: {
    type: Object as PropType<UserType>,
    required: true
  },
});

const userStore = useUserStore();
const isPictureUploaded = ref(false);
const picture = ref();
const picture_url = ref("");
const desc = ref("");
const tags = ref("");

const emit = defineEmits(["close"]);
const openUploadForm = () => {
  document.getElementById("imgInput")!.click();
};
const loadPicture = (event: any) => {
  URL.revokeObjectURL(picture_url.value);
  if (event.target.files[0] === undefined) {
    isPictureUploaded.value = false;
    document.getElementById("svg")!.classList.remove("shadowback");
  } else {
    picture.value = event.target.files[0];
    picture_url.value = URL.createObjectURL(event.target.files[0]);
    isPictureUploaded.value = true;
    document.getElementById("svg")!.classList.add("shadowback");
  }
};
async function post() {
  if (isPictureUploaded.value) {
    let tagsArray = tags.value
      .replace(/\s/g, "")
      .split("#")
      .slice(1)
      .filter((tag) => tag.length <= 50);

    const reader = new FileReader();
    reader.onload = async () => {
      const body = {
        "description": desc.value,
        "picture": reader.result as string,
        "tags": tagsArray
      }

      const res = await createPublication(body, userStore.authKey);
      if (res.status !== 201) {
        console.log("erreur dans la creation de la publication");
      }
      const data = await res.json();

      const newPub = {
        publication_id: data.publication_id,
        picture: picture_url.value,
      } as SimplifiedPublication
      userStore.updateUser();
    }
    reader.readAsDataURL(picture.value);

    emit("close");
  }
};
</script>

<style scoped>
.post {
  background: var(--modal-color);
}

.inputable {
  border-color: var(--color-border);
  background-color: var(--color-background);
}

.desc {
  box-shadow: none;
  resize: none;
}

.tags {
  box-shadow: none;
  resize: none;
  color: var(--special-text-color);
}

.postButton {
  background-color: var(--hover-color);
}

.postButton:hover {
  background-color: var(--color-border);
}

.stack {
  grid-row: 1;
  grid-column: 1;
}

.inputableImage {
  color: rgba(255, 255, 255, 0.3);
}

.shadowback {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
