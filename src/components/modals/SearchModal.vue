<template>
  <div class="fixed inset-0 z-40 flex justify-center items-center">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full" @click="close"></div>
    <div
      class="modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-md PRO:mx-4 translate-x-[126px] PRO:translate-x-0">
      <div class="rounded-md items-center flex flex-col relative max-w-full">
        <div
          class="mb-5 w-full rounded-md h-12 border-2 input-color shutter-border-color pl-4 self-center flex items-center">
          <input class="z-2 outline-none input-color box-border h-11 w-full" v-focus placeholder="Search..." />
          <CrossIcon class="h-6 pr-2" />
        </div>
        <a href="#" class="w-full rounded-md" v-for="user in hardcoded_users.users">
          <div class="py-3 px-1 h-14 flex flex-row items-center">
            <img class="w-10 h-10 rounded-full mr-8"
              src="https://cdn.discordapp.com/attachments/1069318680736964628/1072638173034852463/images.png" alt="" />
            <div class="flex flex-col">
              <span class="font-bold">{{ user.username }}</span>
              <span class="text-sm">{{ user.name }}</span>
            </div>
          </div>
        </a>
        <a href="#" class="w-full rounded-md" v-for="hastag in hardcoded_hashtags.hashtags">
          <div class="py-3 px-1 h-14 flex flex-row items-center">
            <div class="w-10 h-10 rounded-full mr-8 border border-slate-400 flex justify-center items-center">
              <div class="w-5 h-5">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clip-rule="evenodd" fill-rule="evenodd"
                    d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z">
                  </path>
                </svg>
              </div>
            </div>
            <div class="flex flex-col">
              <span class="font-bold">#{{ hastag.name }}</span>
              <span class="text-sm">{{ hastag.count }}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CrossIcon from '../icons/CrossIcon.vue';
const hardcoded_users = {
  users: [
    {
      name: "John Smith",
      username: "jsmith",
      profile_picture: "https://example.com/jsmith.jpg",
    },
    {
      name: "Jane Doe",
      username: "jdoe",
      profile_picture: "https://example.com/jdoe.jpg",
    },
    {
      name: "Bob Johnson",
      username: "bjohnson",
      profile_picture: "https://example.com/bjohnson.jpg",
    },
  ],
};

const hardcoded_hashtags = {
  hashtags: [
    {
      name: "food",
      count: "543,212 posts",
    },
    {
      name: "travel",
      count: "312,345 posts",
    },
    {
      name: "fitness",
      count: "234,567 posts",
    },
    {
      name: "music",
      count: "456,789 posts",
    },
    {
      name: "fashion",
      count: "123,456 posts",
    },
  ],
};
const emit = defineEmits(["close"]);
function close() {
  emit("close");
}
const vFocus = {
  mounted: (el: { focus: () => any; }) => el.focus(),
};
function test(this: any, event: { keyCode: any; }) {
  switch (event.keyCode) {
    case 38:
      if (this.focus === null) {
        this.focus = 0;
      } else if (this.focus > 0) {
        this.focus--;
      }
      break;
    case 40:
      if (this.focus === null) {
        this.focus = 0;
      } else if (this.focus < this.items.length - 1) {
        this.focus++;
      }
      break;
  }
}
</script>
<style>
.modal-color {
  background: var(--modal-color);
}

.input-color {
  background: var(--color-background);
  color: var(--color-text);
}
</style>
