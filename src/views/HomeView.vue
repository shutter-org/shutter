<template>
  <div
    class="shutter-background-mute min-h-screen PRO:min-h-[calc(100vh-160px)] p-10 max-w-5xl ml-auto mr-auto flex flex-col gap-8">
    <publication @vote-up-pub="voteUpPub" @vote-down-pub="voteDownPub" @vote-up-comment="voteUpComment"
      @vote-down-comment="voteDownComment" @search-tag="searchTag" @add-to-gallery="addToGallery"
      @add-comment="addComment" v-for="pub in publications" :publication="pub" :key="pub.publication_id"></publication>
  </div>
</template>

<script setup lang="ts">
import Publication from "@/components/PublicationComponent.vue";
import type { Publication as Pub, SimplifiedUser, Comment } from "@/api/type";
import { ref } from "vue";

let nbNewComment = 0;

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

const pub1 = {
  publication_id: "1",
  poster_user: user1,
  created_date: "10 mars 2023",
  picture:
    "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=pexels-pixabay-206359.jpg&fm=jpg",
  description: "Belle photo au Canadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!",
  tags: ["USA"],
  rating: 12,
  user_rating: 0,
  comments: [com1, com2],
} as Pub;

const pub2 = {
  publication_id: "2",
  poster_user: user2,
  created_date: "9 mars 2023",
  picture:
    "https://pm1.narvii.com/6522/78ef51ad4b97e65dba9a865fdd0a7760595b3790_hq.jpg",
  description: "fuck league",
  tags: [
    "niao",
    "china",
    "testttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
  ],
  rating: 420,
  user_rating: 1,
  comments: [],
} as Pub;

const pub3 = {
  publication_id: "3",
  poster_user: user3,
  created_date: "27 fevrier 2023",
  picture:
    "https://cdn.redmondpie.com/wp-content/uploads/2019/05/macbook-pro-fire-1200px.jpg",
  description: "brule mon mac parce que c'est trash",
  tags: ["apple"],
  rating: -1,
  user_rating: -1,
  comments: [],
} as Pub;

const publications = ref([] as Pub[]);
publications.value.push(pub1);
publications.value.push(pub2);
publications.value.push(pub3);
console.log(publications.value);

const voteUpPub = (pubId: string) => {
  for (let pub of publications.value) {
    if (pub.publication_id === pubId) {
      pub.rating -= pub.user_rating;
      if (pub.user_rating === 1) {
        pub.user_rating = 0;
      } else {
        pub.user_rating = 1;
      }
      pub.rating += pub.user_rating;
    }
  }
};
const voteDownPub = (pubId: string) => {
  for (let pub of publications.value) {
    if (pub.publication_id === pubId) {
      pub.rating -= pub.user_rating;
      if (pub.user_rating === -1) {
        pub.user_rating = 0;
      } else {
        pub.user_rating = -1;
      }
      pub.rating += pub.user_rating;
    }
  }
};
const voteUpComment = (commentId: string, pubId: string) => {
  for (let pub of publications.value) {
    if (pub.picture === pubId) {
      for (let comment of pub.comments) {
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
    }
  }
};
const voteDownComment = (commentId: string, pubId: string) => {
  for (let pub of publications.value) {
    if (pub.picture === pubId) {
      for (let comment of pub.comments) {
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
    }
  }
};
const addComment = (pubId: string, message: string) => {
  const newCom = {
    id: "id reponse serveur" + nbNewComment++,
    user: user1,
    content: message,
    date: new Date().toString().toString().substring(4, 15),
    total_rate: 0,
    user_rate: 0,
  } as Comment;

  for (let pub of publications.value) {
    if (pub.publication_id === pubId) {
      pub.comments.push(newCom);
    }
  }
};
const searchTag = (tag: string) => {
  console.log("searching tag : " + tag);
};
const addToGallery = (pubId: string) => {
  console.log("add publication " + pubId + " to gallery");
};
</script>

