<template>
    <div class="flex flex-col ">
        <div class="flex flex-row justify-between">
            <div class="font-bold text-2xl pl-2">titre</div>
            <div class="text-xl pr-2">date</div>
        </div>
        <div class="scrollmenu" v-dragscroll>
            <button v-for="publication in props.gallery.publications" class="w-80 px-1"
                @click="emit('openPublicationModal', publication.publication_id)">
                <ImgLoader class="w-full object-cover aspect-square rounded-lg" :src="publication.picture" />
            </button>
        </div>
        <div class="flex flex-row justify-between">
            <RatingInterface :total_rate="2"></RatingInterface>
            <div class="flex flex-row">
                <button>
                    <ModifyIcon></ModifyIcon>
                </button>
                <DeleteComponent></DeleteComponent>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import ImgLoader from "./ImgLoader.vue";
import type { Gallery } from "@/api/type";
import type { PropType } from "vue";
import ModifyIcon from "@/components/icons/modifyIcon.vue";
import DeleteComponent from "./subComponents/DeleteComponent.vue";
import RatingInterface from "./subComponents/RatingInterface.vue";

const props = defineProps({
    gallery: {
        type: Object as PropType<Gallery>,
        required: true
    }
})
const emit = defineEmits({
    openPublicationModal: (publicationId: string) => {
        return !!publicationId;
    }
});
</script>
<style>
div.scrollmenu {
    overflow: auto;
    white-space: nowrap;
}
</style>