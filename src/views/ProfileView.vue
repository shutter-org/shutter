<template>
  <div
    class="profile min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8"
  >
    <Profile :user="user"></Profile>
  </div>
</template>

<script lang="ts">
import type { User, SimplifiedPost } from "@/api/type";
import { defineComponent } from "vue";
import Profile from "@/components/ProfileComponent.vue";

const post1 = {
  id: "p1",
  picture:
    "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=pexels-pixabay-206359.jpg&fm=jpg",
} as SimplifiedPost;

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

const user = {
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

export default defineComponent({
  components: { Profile },
  data() {
    return {
      user: user,
    };
  },
  methods: {},
});
</script>

<style>
.profile {
  background-color: var(--color-background-mute);
}
</style>
