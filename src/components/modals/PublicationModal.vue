<template>
  <div class="fixed inset-0 z-50 flex justify-center overflow-y-scroll">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')"></div>
    <div class="relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
      <publication-component class="" @vote-up-pub="voteUpPub" @vote-down-pub="voteDownPub"
        @vote-up-comment="voteUpComment" @vote-down-comment="voteDownComment" @search-tag="searchTag"
        @add-to-gallery="addToGallery" @add-comment="(publicationId: string, message: string) => addComment(message)"
        :publication="shownPublication"></publication-component>
      <div class="h-10"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  Comment,
  Publication,
  SimplifiedUser,
  User,
} from "@/api/type";
import PublicationComponent from "@/components/PublicationComponent.vue";
import { ref } from "vue";

const user1 = {
  username: "Blond141",
  profile_picture:
    "https://h5p.org/sites/default/files/h5p/content/1209180/images/file-6113d5f8845dc.jpeg",
} as SimplifiedUser;

const user2 = {
  username: "Chinman69",
  profile_picture:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Chinese_flag_%28Beijing%29_-_IMG_1104.jpg/220px-Chinese_flag_%28Beijing%29_-_IMG_1104.jpg",
} as SimplifiedUser;

const user3 = {
  username: "Alex_Prudent",
  profile_picture:
    "https://i5.walmartimages.ca/images/Enlarge/061/024/999999-773554061024.jpg",
} as SimplifiedUser;

const com1 = {
  id: "c1",
  user: user2,
  content: "wow!",
  date: "11 mars 2023",
  total_rate: 1,
  user_rate: 1,
} as Comment;

const com2 = {
  id: "c2",
  user: user3,
  content: "nice",
  date: "12 mars 2023",
  total_rate: 0,
  user_rate: 0,
} as Comment;

const post1Complete = {
  id: "pub1",
  user: user1,
  date: "10 mars 2023",
  picture:
    "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=pexels-pixabay-206359.jpg&fm=jpg",
  desc: "Belle photo au Canadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!",
  tags: ["USA"],
  total_rate: 12,
  user_rate: 0,
  comments: [com1, com2],
} as Publication;

let nbNewComment = 0;

const props = defineProps({
  publicationId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const shownPublication = ref(post1Complete);

//fetch pub


const voteUpPub = () => {
  //put pub
  shownPublication.value.total_rate -= shownPublication.value.user_rate;
  if (shownPublication.value.user_rate === 1) {
    shownPublication.value.user_rate = 0;
  } else {
    shownPublication.value.user_rate = 1;
  }
  shownPublication.value.total_rate += shownPublication.value.user_rate;
};
const voteDownPub = () => {
  //put pub
  shownPublication.value.total_rate -= shownPublication.value.user_rate;
  if (shownPublication.value.user_rate === -1) {
    shownPublication.value.user_rate = 0;
  } else {
    shownPublication.value.user_rate = -1;
  }
  shownPublication.value.total_rate += shownPublication.value.user_rate;
};
const voteUpComment = (commentId: string) => {
  //put pub
  for (let comment of shownPublication.value.comments) {
    if (comment.id === commentId) {
      comment.total_rate -= comment.user_rate;
      if (comment.user_rate === 1) {
        comment.user_rate = 0;
      } else {
        comment.user_rate = 1;
      }
      comment.total_rate += comment.user_rate;
    }
  }
};
const voteDownComment = (commentId: string) => {
  //put pub
  for (let comment of shownPublication.value.comments) {
    if (comment.id === commentId) {
      comment.total_rate -= comment.user_rate;
      if (comment.user_rate === -1) {
        comment.user_rate = 0;
      } else {
        comment.user_rate = -1;
      }
      comment.total_rate += comment.user_rate;
    }
  }
};
const addComment = (message: string) => {
  //post
  const newCom = {
    id: "id reponse serveur" + nbNewComment++,
    user: user1,
    content: message,
    date: new Date().toString().toString().substring(4, 15),
    total_rate: 0,
    user_rate: 0,
  } as Comment;

  //fetch pub
  shownPublication.value.comments.push(newCom);
};
const searchTag = (tag: string) => {
  console.log("searching tag : " + tag);
};
const addToGallery = () => {
  console.log("add publication " + shownPublication.value.id + " to gallery");
};
</script>

<style scoped></style>
