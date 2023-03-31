<template>
  <div class="fixed inset-0 z-50 flex flex-col gap-8 overflow-y-scroll py-10 items-center px-12">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')"></div>
    <div
      class="shutter-modal-color flex flex-col gap-4 items-center rounded-lg p-4 relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
      <!-- User identifications -->
      <div class="flex flex-row items-center justify-between w-full">
        <User class="h-14 mr-auto" :user="userStore.getSimplifiedUser()"></User>
      </div>

      <!-- Picture uploader -->
      <button @click="openUploadForm"
        class="shutter-border-color shutter-background-color inputable w-full aspect-square object-cover rounded-lg grid grid-cols-1 grid-rows-1 justify-center items-center border-2">
        <ImgLoader id="picture" v-if="isPictureUploaded" :src="picture_url" alt=""
          class="w-full aspect-square object-cover rounded-lg stack" />
        <div id="svg" class="w-full aspect-square stack z-50 rounded-lg flex justify-center">
          <ImageIcon class="w-1/2 aspect-square inputableImage"></ImageIcon>
        </div>
      </button>
      <input class="hidden" type="file" id="imgInput" name="img" accept="image/*" @change="loadPicture" />

      <!-- Multiline text input (description, tags) -->
      <textarea
        class="shutter-border-color shutter-background-color inputable desc h-36 w-full text-xl p-2 border-2 rounded-lg"
        placeholder="Description..." maxlength="200" v-model="desc" />
      <textarea
        class="shutter-border-color shutter-background-color inputable tags h-32 w-full text-xl p-2 border-2 rounded-lg"
        placeholder="Tags..." maxlength="160" v-model="tags" />

      <!-- error message -->
      <p class="text-lg inline h-7 items-center text-red-500">{{ errorMessage }}</p>

      <!-- Post button -->
      <button @click="post" class="modalButton text-xl p-2 rounded-lg pr-10 pl-10">
        Post
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import User from "@/components/userComponents/UserComponent.vue";
import ImageIcon from "@/components/icons/ImageIcon.vue";
import ImgLoader from "../ImgLoader.vue";
import { createPublication } from "@/api/publication";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useUserStore } from "@/stores/user";
import type { SimplifiedPublication, SimplifiedUser as UserType } from "@/api/type";

const userStore = useUserStore();
const isPictureUploaded = ref(false);
const picture = ref();
const picture_url = ref("");
const desc = ref("");
const tags = ref("");
const errorMessage = ref("");

const emit = defineEmits(["close"]);
const openUploadForm = () => {
  document.getElementById("imgInput")!.click();
};

onMounted(() => {
  document.addEventListener("keydown", onKeyDownEscape);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeyDownEscape);
});

function onKeyDownEscape(e: KeyboardEvent) {
  if (e.key === "Escape") {
    emit("close");
  }
}
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
    if (desc.value !== "") {
      let tagsArray = tags.value
        .replace(/\s/g, "")
        .split("#")
        .slice(1)
        .filter((tag) => tag.length <= 50);

      const reader = new FileReader();
      reader.onload = async () => {
        const body = {
          description: desc.value,
          picture: reader.result as string,
          tags: tagsArray,
        };

        const res = await createPublication(body, userStore.authKey);
        if (res.status !== 201) {
          console.log("erreur dans la creation de la publication");
        }
        const data = await res.json();

        const newPub = {
          publication_id: data.publication_id,
          picture: picture_url.value,
        } as SimplifiedPublication;
        userStore.loadShownUser(userStore.username);
      };
      reader.readAsDataURL(picture.value);

      emit("close");
    }
    else {
      errorMessage.value = "The description must not be empty";
      setTimeout(() => errorMessage.value = "", 3000);
    }
  }
  else {
    errorMessage.value = "A picture must be uploaded";
    setTimeout(() => errorMessage.value = "", 3000);
  }
}
</script>
