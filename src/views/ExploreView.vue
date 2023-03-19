<template>
  <div
    class="shutter-background-mute min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8">
    <div
      class="shutter-border-color shutter-background-color w-full flex flex-col gap-2 items-center rounded-lg p-4 border-2 h-full">
      <div
        class="my-10 w-64 rounded-md h-12 border-2 input-color pl-4 self-center flex-row flex items-center shutter-border-color">
        <input class="z-2 outline-none input-color box-border w-full h-11 rounded-md" v-focus placeholder="Search..." />
        <CrossIcon class="h-6 pr-2" />
      </div>
      <div class="flex flex-wrap justify-center gap-4">
        <button class="w-52 h-52 rounded-lg" v-for="post in posts" @click="openPublicationModal(post.id)">
          <img class="w-full object-cover aspect-square rounded-lg" :src="post.picture" />
        </button>
        <PublicationModal v-if="isPublicationModalShown" @close="closePublicationModal" :publication="shownPublication" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { SimplifiedPublication, Comment, Publication, SimplifiedUser } from "@/api/type";
import CrossIcon from "@/components/icons/CrossIcon.vue";
import PublicationModal from "@/components/modals/PublicationModal.vue";

const isPublicationModalShown = ref(false);
const shownPublication = ref();

const openPublicationModal = (publicationId: string) => {
  console.log(publicationId);
  //fetch pub
  shownPublication.value = post1Complete;
  isPublicationModalShown.value = true;
};
const closePublicationModal = () => {
  isPublicationModalShown.value = false;
};
const vFocus = {
  mounted: (el: { focus: () => any; }) => el.focus(),
};
const post1 = {
  id: "p1",
  picture:
    "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=pexels-pixabay-206359.jpg&fm=jpg",
} as SimplifiedPublication;

const post2 = {
  id: "p2",
  picture:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Snowboard_pow.jpg/1200px-Snowboard_pow.jpg",
} as SimplifiedPublication;

const post3 = {
  id: "p3",
  picture:
    "https://www.inquirer.com/resizer/yMCs3mgc-4b3hxAMeaho6H8BVbw=/760x507/smart/filters:format(webp)/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/J4QDHA4WPZHJJJKAUWMI6HGL6A.jpg",
} as SimplifiedPublication;
const post4 = {
  id: "p4",
  picture:
    "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
} as SimplifiedPublication;

const post5 = {
  id: "p5",
  picture:
    "https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg",
} as SimplifiedPublication;

const post6 = {
  id: "p6",
  picture:
    "https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg",
} as SimplifiedPublication;
const post7 = {
  id: "p7",
  picture:
    "https://pe-images.s3.amazonaws.com/basics/cc/image-size-resolution/resize-images-for-print/image-cropped-8x10.jpg",
} as SimplifiedPublication;
const post8 = {
  id: "p8",
  picture:
    "https://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg",
} as SimplifiedPublication;
const post9 = {
  id: "p9",
  picture:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTToy1vrfJ_4td_O5ofsY7f_0FrmTPCmIUWg&usqp=CAU",
} as SimplifiedPublication;
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
const posts = [post1, post2, post3, post4, post5, post6, post7, post8, post9];


</script>
