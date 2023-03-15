<template>
  <div class="home p-10 max-w-5xl ml-auto mr-auto flex flex-col gap-8">
    <publication
      @vote-up-pub="voteUpPub"
      @vote-down-pub="voteDownPub"
      @vote-up-comment="voteUpComment"
      @vote-down-comment="voteDownComment"
      @search-tag="searchTag"
      @add-to-gallery="addToGallery"
      v-for="pub in publications"
      :publication="pub"
      :key="pub.id"
    ></publication>
  </div>
</template>

<script lang="ts">
import Publication from "@/components/Publication.vue";
import type { Publication as Pub, User, Comment } from "@/api/type";
import { defineComponent } from "vue";

const user1 = {
  id: "u1",
  username: "Blond141",
  profile_picture:
    "https://h5p.org/sites/default/files/h5p/content/1209180/images/file-6113d5f8845dc.jpeg",
} as User;

const user2 = {
  id: "u2",
  username: "Chinman69",
  profile_picture:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Chinese_flag_%28Beijing%29_-_IMG_1104.jpg/220px-Chinese_flag_%28Beijing%29_-_IMG_1104.jpg",
} as User;

const user3 = {
  id: "u3",
  username: "Alex_Prudent",
  profile_picture:
    "https://i5.walmartimages.ca/images/Enlarge/061/024/999999-773554061024.jpg",
} as User;

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
  id: "1",
  user: user1,
  date: "10 mars 2023",
  picture:
    "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=pexels-pixabay-206359.jpg&fm=jpg",
  desc: "Belle photo au Canadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!",
  tags: ["USA"],
  total_rate: 12,
  user_rate: 0,
  comments: [com1, com2],
} as Pub;

const pub2 = {
  id: "2",
  user: user2,
  date: "9 mars 2023",
  picture:
    "https://pm1.narvii.com/6522/78ef51ad4b97e65dba9a865fdd0a7760595b3790_hq.jpg",
  desc: "fuck league",
  tags: [
    "niao",
    "china",
    "testttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
  ],
  total_rate: 420,
  user_rate: 1,
  comments: [],
} as Pub;

const pub3 = {
  id: "3",
  user: user3,
  date: "27 fevrier 2023",
  picture:
    "https://cdn.redmondpie.com/wp-content/uploads/2019/05/macbook-pro-fire-1200px.jpg",
  desc: "brule mon mac parce que c'est trash",
  tags: ["apple"],
  total_rate: -1,
  user_rate: -1,
  comments: [],
} as Pub;

export default defineComponent({
  components: {
    Publication,
  },
  data() {
    return {
      publications: [pub1, pub2, pub3] as Pub[],
    };
  },
  methods: {
    voteUpPub(pubId: string) {
      for (let pub of this.publications) {
        if (pub.id === pubId) {
          pub.total_rate -= pub.user_rate;
          if (pub.user_rate === 1) {
            pub.user_rate = 0;
          } else {
            pub.user_rate = 1;
          }
          pub.total_rate += pub.user_rate;
        }
      }
    },
    voteDownPub(pubId: string) {
      for (let pub of this.publications) {
        if (pub.id === pubId) {
          pub.total_rate -= pub.user_rate;
          if (pub.user_rate === -1) {
            pub.user_rate = 0;
          } else {
            pub.user_rate = -1;
          }
          pub.total_rate += pub.user_rate;
        }
      }
    },
    voteUpComment(commentId: string, pubId: string) {
      for (let pub of this.publications) {
        if (pub.id === pubId) {
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
    },
    voteDownComment(commentId: string, pubId: string) {
      for (let pub of this.publications) {
        if (pub.id === pubId) {
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
    },
    searchTag(tag: string) {
      console.log("searching tag : " + tag);
    },
    addToGallery(pubId: string) {
      console.log("add publication " + pubId + " to gallery");
    },
  },
});
</script>

<style>
.home {
  background-color: var(--color-background-mute);
}
</style>
