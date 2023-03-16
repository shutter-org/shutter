<template>
    <div class="p-10 max-w-5xl ml-auto mr-auto flex flex-col min-h-screen PRO:min-h-[calc(100vh-160px)]">
        <div class="mb-10 w-64 rounded-md h-12 input-color pl-4 self-center flex-row flex items-center">
            <input class="z-2 outline-none input-color border-0 box-border w-full h-12  rounded-md"
                placeholder="Search..." />
            <CrossIcon class="h-6 pr-2" />
        </div>
        <div class="flex flex-wrap justify-center gap-4">
            <button href="#" class="w-52 h-52 rounded-lg" v-for="post in posts" :key="post.id">
                <img class="w-full object-cover aspect-square rounded-lg" :src="post.picture" />

            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { SimplifiedPost } from "@/api/type";
import CrossIcon from "@/components/icons/CrossIcon.vue";
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
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
} as SimplifiedPost;

const post5 = {
    id: "p5",
    picture:
        "https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg",
} as SimplifiedPost;

const post6 = {
    id: "p6",
    picture:
        "https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg"
} as SimplifiedPost;
const post7 = {
    id: "p7",
    picture:
        "https://pe-images.s3.amazonaws.com/basics/cc/image-size-resolution/resize-images-for-print/image-cropped-8x10.jpg"
} as SimplifiedPost;
const post8 = {
    id: "p8",
    picture:
        "https://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg"
} as SimplifiedPost;
const post9 = {
    id: "p9",
    picture:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTToy1vrfJ_4td_O5ofsY7f_0FrmTPCmIUWg&usqp=CAU"
} as SimplifiedPost;

const posts = [post1, post2, post3, post4, post5, post6, post7, post8, post9];
</script>