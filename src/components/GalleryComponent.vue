<template>
    <div class="scrollmenu" v-dragscroll>
        <button v-for="post of 10" class="w-80 px-1">
            <ImgLoader class="w-full object-cover aspect-square rounded-lg"
                src="https://ik.imagekit.io/shutterAppULaval/publications/de304de6-5e7c-42a4-975a-e91644e702c9?37677628511" />
        </button>
    </div>
</template>
<script setup lang="ts">
import ImgLoader from "./ImgLoader.vue";

</script>
<style>
div.scrollmenu {
    overflow: auto;
    white-space: nowrap;
}
</style>