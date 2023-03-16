<template>
    <div class="z-50 fixed inset-0 flex justify-center items-center">
        <div class=" fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="close"></div>
        <div
            class="post flex flex-col gap-4 items-center rounded-lg p-4 relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
            <img :src="post.picture" class="aspect-w-1 aspect-h-1" />
        </div>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(["close"])
function close() {
    emit("close")
}
const post = {
    "comments": [
        {
            "comment_id": "26f62411-6e13-43d3-934f-e6d0c0054f18",
            "commenter_user": {
                "profile_picture": "https://is4-ssl.mzstatic.com/image/thumb/Purple114/v4/2d/19/2e/2d192ee2-8980-563e-7ad2-d1699f6c46d3/AppIcons-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1024x1024.jpg",
                "username": "jegir69"
            },
            "created_date": "2023-03-16 13:09:13",
            "message": "updated message",
            "rating": 2,
            "user_rating": 1
        },
        {
            "comment_id": "77ac0d86-7932-4e5c-a22f-4e3f0a208b46",
            "commenter_user": {
                "profile_picture": "https://is4-ssl.mzstatic.com/image/thumb/Purple114/v4/2d/19/2e/2d192ee2-8980-563e-7ad2-d1699f6c46d3/AppIcons-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1024x1024.jpg",
                "username": "jegir69"
            },
            "created_date": "2023-03-16 03:39:18",
            "message": "Epic skin",
            "rating": 1,
            "user_rating": 1
        }
    ],
    "created_date": "2023-03-14 23:26:45",
    "description": "csgo picture",
    "picture": "https://wallpaper.dog/large/10839283.jpg",
    "poster_user": {
        "profile_picture": "https://is4-ssl.mzstatic.com/image/thumb/Purple114/v4/2d/19/2e/2d192ee2-8980-563e-7ad2-d1699f6c46d3/AppIcons-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1024x1024.jpg",
        "username": "jegir69"
    },
    "publication_id": "31460e06-e006-417e-9020-a5ea50479a1c",
    "rating": 3,
    "user_rating": 1
}
</script>
<style></style>