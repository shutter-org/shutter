<template>
    <div
        class="min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8 shutter-background-mute">
        <SyncLoader v-if="isLoading" color="#465A82" size="30px" class="m-auto" />
        <Profile v-else-if="doesUserExist" :user="user" :is-current-user="false"
            @open-publication-modal="openPublicationModal" @follow="follow" @unfollow="unfollow"></Profile>
        <div v-else
            class="flex flex-col m-auto items-center p-10 rounded-lg border-2 shutter-border-color shutter-background-color">
            <SadIcon class="w-40 h-40"></SadIcon>
            <p class="text-3xl">User does not exist...</p>
        </div>
        <PublicationModal class="PRO:my-[80px] p-12" v-if="isPublicationModalShown" :publicationId="shownPublicationId"
            @close="closePublicationModal" />
    </div>
</template>
  
<script setup lang="ts">
import type {
    SimplifiedPublication,
    User,
    SimplifiedUser
} from "@/api/type";
import { ref } from "vue";
import Profile from "@/components/ProfileComponent.vue";
import PublicationModal from "@/components/modals/PublicationModal.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import SadIcon from "@/components/icons/SadIcon.vue";
import { getUser } from "@/api/user";
import { useUserStore } from '@/stores/user'
import { useRoute } from "vue-router";

//fetch user

/*
const post1 = {
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
    followers: [] as SimplifiedUser[],
    following: [] as SimplifiedUser[],
    biography: "glo ulaval",
    age: 21,
    created_date: "feb 2 2012",
    publications: [post1, post2, post3, post4],
    gallerys: [],
    followed_by_user: false,
} as User;*/

const userStore = useUserStore();
const route = useRoute();
const user = ref();
const isPublicationModalShown = ref(false);
const shownPublicationId = ref("");
const isLoading = ref(true);
const doesUserExist = ref(false);

loadUser(route.params.username as string);

async function loadUser(username: string) {
    const res = await getUser(username, userStore.authKey);
    if (res.status === 200) {
        user.value = await res.json();
        user.value.profile_picture = user.value.profile_picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        doesUserExist.value = true;
    }
    isLoading.value = false;
};
const openPublicationModal = (publicationId: string) => {
    console.log(publicationId);
    //fetch pub
    shownPublicationId.value = "id de la pub";
    isPublicationModalShown.value = true;
};
const closePublicationModal = () => {
    isPublicationModalShown.value = false;
};
const follow = () => {
    user.value.followed_by_user = true;
}
const unfollow = () => {
    user.value.followed_by_user = false;
}
</script>