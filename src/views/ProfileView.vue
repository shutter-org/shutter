<template>
  <div
    class="min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8 shutter-background-mute">
    <SyncLoader v-if="isLoading" color="#465A82" size="30px" class="m-auto" />
    <Profile v-else :user="user" :is-current-user="true" @open-publication-modal="openPublicationModal"
      @open-profile-modification-modal="openProfileModificationModal"></Profile>
    <PublicationModal class="PRO:my-[80px] p-12" v-if="isPublicationModalShown" :publicationId="shownPublicationId"
      @close="closePublicationModal" />
    <ProfileModificationModal v-if="isProfileModificationShown" :user="user" @close="closeProfileModificationModal"
      @save="save" />
  </div>
</template>

<script setup lang="ts">
import type {
  SimplifiedPublication,
  User,
} from "@/api/type";
import { ref } from "vue";
import Profile from "@/components/ProfileComponent.vue";
import PublicationModal from "@/components/modals/PublicationModal.vue";
import ProfileModificationModal from "@/components/modals/ProfileModificationModal.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue"
import { getUser, updateUser } from "@/api/user";
import { useUserStore } from '@/stores/user'

/*const post1 = {
  publicationId: "p1",
  picture:
    "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=pexels-pixabay-206359.jpg&fm=jpg",
} as SimplifiedPublication;

const post2 = {
  publicationId: "p2",
  picture:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Snowboard_pow.jpg/1200px-Snowboard_pow.jpg",
} as SimplifiedPublication;

const post3 = {
  publicationId: "p3",
  picture:
    "https://www.inquirer.com/resizer/yMCs3mgc-4b3hxAMeaho6H8BVbw=/760x507/smart/filters:format(webp)/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/J4QDHA4WPZHJJJKAUWMI6HGL6A.jpg",
} as SimplifiedPublication;

const post4 = {
  publicationId: "p4",
  picture:
    "https://assets3.thrillist.com/v1/image/3120392/1200x630/flatten;crop_down;webp=auto;jpeg_quality=70",
} as SimplifiedPublication;

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
} as User;*/
const userStore = useUserStore();
const user = ref();
const isPublicationModalShown = ref(false);
const shownPublicationId = ref("");
const isProfileModificationShown = ref(false);
const isLoading = ref(true);

loadUser();

async function loadUser() {
  const res = await getUser(userStore.username, userStore.authKey);
  if (res.status !== 200) {
    console.log("erreur dans le username ou mdp");
  }
  else {
    user.value = await res.json();
    user.value.profile_picture = user.value.profile_picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  }
  isLoading.value = false;
};
async function save(picture_url: string, username: string, name: string, bio: string) {
  const body = {} as User;
  if (user.value.profile_picture !== picture_url) {
    user.value.profile_picture = picture_url;
    body.profile_picture = picture_url;
  }
  if (user.value.username !== username) {
    user.value.username = username;
    body.username = username;
  }
  if (user.value.name !== name) {
    user.value.name = name;
    //body.name = name;
  }
  if (user.value.biography !== bio) {
    user.value.biography = bio;
    body.biography = bio;
  }

  if (Object.keys(body).length !== 0) {
    console.log("updating user");
    const res = await updateUser(userStore.username, userStore.authKey, body);
    userStore.username = username;
    if (res.status !== 200) {
      console.log("erreur dans l'update");
    }
  }

  isProfileModificationShown.value = false;
}
const openPublicationModal = (publicationId: string) => {
  console.log(publicationId);
  //fetch pub
  shownPublicationId.value = "id de la pub";
  isPublicationModalShown.value = true;
};
const closePublicationModal = () => {
  isPublicationModalShown.value = false;
};
const openProfileModificationModal = () => {
  isProfileModificationShown.value = true;
};
const closeProfileModificationModal = () => {
  isProfileModificationShown.value = false;
};
</script>

