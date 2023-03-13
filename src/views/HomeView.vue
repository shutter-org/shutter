<template>
  <div class="home p-10 max-w-5xl ml-auto mr-auto flex flex-col gap-8">
    <Publication :publication="this.publications[0]"></Publication>
    <Publication :publication="this.publications[1]"></Publication>
    <Publication :publication="this.publications[2]"></Publication>
  </div>
</template>

<script lang="ts">
import Publication from "@/components/Publication.vue";
import type { Publication as Pub, User, Comment } from "@/api/type";

const user1 = {
  username: "Blond141",
  profile_picture:
    "https://h5p.org/sites/default/files/h5p/content/1209180/images/file-6113d5f8845dc.jpeg",
} as User;

const user2 = {
  username: "Chinman69",
  profile_picture:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Chinese_flag_%28Beijing%29_-_IMG_1104.jpg/220px-Chinese_flag_%28Beijing%29_-_IMG_1104.jpg",
} as User;

const user3 = {
  username: "Alex_Prudent",
  profile_picture:
    "https://i5.walmartimages.ca/images/Enlarge/061/024/999999-773554061024.jpg",
} as User;

const com1 = {
  user: user2,
  content: "wow!",
  date: "11 mars 2023",
} as Comment;

const com2 = {
  user: user3,
  content: "nice",
  date: "12 mars 2023",
} as Comment;

const pub1 = {
  user: user1,
  date: "10 mars 2023",
  picture:
    "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=pexels-pixabay-206359.jpg&fm=jpg",
  desc: "Belle photo au Canadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!",
  tags: [],
  total_rate: 12,
  user_rate: 0,
  comments: [com1, com2],
} as Pub;

const pub2 = {
  user: user2,
  date: "9 mars 2023",
  picture:
    "https://pm1.narvii.com/6522/78ef51ad4b97e65dba9a865fdd0a7760595b3790_hq.jpg",
  desc: "fuck league",
  tags: [],
  total_rate: 420,
  user_rate: 1,
  comments: [],
} as Pub;

const pub3 = {
  user: user3,
  date: "27 fevrier 2023",
  picture:
    "https://cdn.redmondpie.com/wp-content/uploads/2019/05/macbook-pro-fire-1200px.jpg",
  desc: "brule mon mac parce que c'est trash",
  tags: [],
  total_rate: -1,
  user_rate: -1,
  comments: [],
} as Pub;

export default {
  components: {
    Publication,
  },
  data() {
    return {
      publications: [pub1, pub2, pub3] as Pub[],
    };
  },
};
</script>

<style>
.home {
  background-color: var(--color-background-soft);
}
</style>
