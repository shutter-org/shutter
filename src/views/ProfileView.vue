<template>
  <div
    class="min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8 shutter-background-mute">
    <Profile :user="user" :is-current-user="true" @open-publication-modal="openPublicationModal"
      @open-profile-modification-modal="openProfileModificationModal"></Profile>
    <PublicationModal class="PRO:my-[80px] p-12" v-if="isPublicationModalShown" :publication="shownPublication"
      @vote-up-pub="voteUpPub" @vote-down-pub="voteDownPub" @vote-up-comment="voteUpComment"
      @vote-down-comment="voteDownComment" @search-tag="searchTag" @add-to-gallery="addToGallery"
      @add-comment="addComment" @close="closePublicationModal" />
    <ProfileModificationModal v-if="isProfileModificationShown" :user="user" @close="closeProfileModificationModal" />
  </div>
</template>

<script setup lang="ts">
import type {
  Comment,
  Publication,
  SimplifiedPost,
  SimplifiedUser,
  User,
} from "@/api/type";
import { ref } from "vue";
import Profile from "@/components/ProfileComponent.vue";
import PublicationModal from "@/components/modals/PublicationModal.vue";
import ProfileModificationModal from "@/components/modals/ProfileModificationModal.vue";

let nbNewComment = 0;

const post1 = {
  id: "p1",
  picture:
    "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=pexels-pixabay-206359.jpg&fm=jpg",
} as SimplifiedPost;

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

const post2 = {
  id: "p2",
  picture:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Snowboard_pow.jpg/1200px-Snowboard_pow.jpg",
} as SimplifiedPost;

const post3 = {
  id: "p3",
  picture:
    "https://www.inquirer.com/resizer/yMCs3mgc-4b3hxAMeaho6H8BVbw=/760x507/smart/filters:format(webp)/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/J4QDHA4WPZHJJJKAUWMI6HGL6A.jpg",
} as SimplifiedPost;

const post4 = {
  id: "p4",
  picture:
    "https://assets3.thrillist.com/v1/image/3120392/1200x630/flatten;crop_down;webp=auto;jpeg_quality=70",
} as SimplifiedPost;

const user1Complete = {
  username: "Blond141",
  name: "Jerome Levesque",
  profile_picture:
    "https://h5p.org/sites/default/files/h5p/content/1209180/images/file-6113d5f8845dc.jpeg",
  nb_follower: 242,
  nb_following: 132,
  biography: "glo ulaval",
  age: 21,
  created_date: "feb 2 2012",
  posts: [post1, post2, post3, post4],
} as User;

const user = ref(user1Complete);
const isPublicationModalShown = ref(false);
const shownPublication = ref();
const isProfileModificationShown = ref(false);

const openPublicationModal = (publicationId: string) => {
  console.log(publicationId);
  //fetch pub
  shownPublication.value = post1Complete;
  isPublicationModalShown.value = true;
};
const closePublicationModal = () => {
  isPublicationModalShown.value = false;
};
const openProfileModificationModal = () => {
  isProfileModificationShown.value = true
};
const closeProfileModificationModal = () => {
  isProfileModificationShown.value = false
};
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

