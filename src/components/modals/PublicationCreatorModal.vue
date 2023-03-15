<template>
  <div class="fixed inset-0 z-40 flex justify-center items-center">
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10"
      @click="this.$emit('close')"
    ></div>
    <div
      class="post flex flex-col gap-4 items-center rounded-lg p-4 relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4"
    >
      <div class="flex flex-row items-center justify-between w-full">
        <User class="h-14 mr-auto" :user="user"></User>
      </div>
      <img
        id="picture"
        v-show="isPictureUploaded"
        src=""
        alt=""
        class="w-full aspect-square object-cover rounded-lg flex flex-row justify-center items-center"
      />
      <button
        v-show="!isPictureUploaded"
        @click="openUploadForm"
        class="inputable w-full aspect-square object-cover rounded-lg flex flex-row justify-center items-center border-2"
      >
        <ImageIcon class="w-1/2 aspect-square"></ImageIcon>
      </button>
      <input
        class="hidden"
        type="file"
        id="imgInput"
        name="img"
        accept="image/*"
        @change="loadPicture"
      />
      <textarea
        class="inputable desc h-36 w-full text-xl p-2 border-2 rounded-lg"
        placeholder="Description..."
        maxlength="200"
        v-model="desc"
      />
      <textarea
        class="inputable tags h-32 w-full text-xl p-2 border-2 rounded-lg"
        placeholder="Tags..."
        maxlength="160"
        v-model="tags"
      />
      <button
        @click="post"
        class="postButton text-xl p-2 rounded-lg pr-10 pl-10"
      >
        Post
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import User from "@/components/User.vue";
import ImageIcon from "@/components/icons/ImageIcon.vue";
import type { SimplifiedUser as UserType } from "@/api/type";
import type { PropType } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    ImageIcon,
    User,
  },
  name: "default-publication",
  data() {
    return {
      areCommentsShown: false,
      isPictureUploaded: false,
      picture: Blob,
      desc: "",
      tags: "",
    };
  },
  props: {
    user: {} as PropType<UserType>,
  },
  methods: {
    openUploadForm() {
      document.getElementById("imgInput")!.click();
    },
    loadPicture(event: any) {
      let picture = document.getElementById("picture") as HTMLImageElement;
      URL.revokeObjectURL(picture.src);
      if (event.target.files[0] === undefined) {
        this.isPictureUploaded = false;
      } else {
        this.picture = event.target.files[0];
        picture.src = URL.createObjectURL(event.target.files[0]);
        this.isPictureUploaded = true;
      }
    },
    post() {
      if (this.isPictureUploaded) {
        let tagsArray = this.tags
          .replace(/\s/g, "")
          .split("#")
          .slice(1)
          .filter((tag) => tag.length <= 50);

        console.log(this.picture);
        console.log(this.desc);
        console.log(tagsArray);

        let picture = document.getElementById("picture") as HTMLImageElement;
        URL.revokeObjectURL(picture.src);

        this.isPictureUploaded = false;
        this.desc = "";
        this.tags = "";

        this.$emit("close");
      }
    },
  },
});
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
  color: var(--tag-color);
}

.postButton {
  background-color: var(--hover-color);
}

.postButton:hover {
  background-color: var(--tag-color);
}
</style>
