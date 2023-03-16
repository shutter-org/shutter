<template>
    <div class="fixed inset-0 z-40 flex justify-center items-center">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')">
        </div>
        <div
            class="post flex flex-col gap-4 items-center rounded-lg p-4 relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
            <div
                class="shutter-border-color shutter-background-color w-full flex flex-col gap-2 items-center rounded-lg p-4">
                <div class="w-full h-40 PRO:h-80 flex flex-row PRO:flex-col gap-10 items-center p-2">
                    <button class="h-full PRO:h-1/2 aspect-square rounded-full border-2" @click="openUploadForm">
                        <img id="picture" class="h-full w-full object-cover aspect-square rounded-full"
                            :src="picture_url" />
                    </button>
                    <input class="hidden" type="file" id="imgInput" name="img" accept="image/*" @change="loadPicture" />
                    <div class="h-full w-full flex flex-col gap-4 justify-center overflow-x-auto">
                        <p
                            class="w-full font-bold text-4xl inline overflow-hidden whitespace-nowrap overflow-ellipsis PRO:text-center">
                            {{ props.user.username }}
                        </p>
                        <p
                            class="w-full font-bold text-2xl inline overflow-hidden whitespace-nowrap overflow-ellipsis PRO:text-center">
                            {{ props.user.name }} • {{ props.user.age }}
                        </p>
                    </div>
                </div>
                <div class="w-full h-20 flex flex-row gap-10 items-center p-2 justify-evenly">
                    <p class="w-full font-bold text-xl PRO:text-lg overflow-hidden overflow-ellipsis text-center">
                        {{ props.user.posts.length }} Posts
                    </p>
                    <p class="w-full font-bold text-xl PRO:text-lg overflow-hidden overflow-ellipsis text-center">
                        {{ props.user.nb_follower }} Followers
                    </p>
                    <p class="w-full font-bold text-xl PRO:text-lg overflow-hidden overflow-ellipsis text-center">
                        {{ props.user.nb_following }} Following
                    </p>
                </div>
                <button class="text-xl p-2 rounded-lg pr-10 pl-10 saveButton">save</button>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import type { User } from "@/api/type";
import type { PropType } from "vue";
import { ref } from "vue";

const props = defineProps({
    user: {
        type: Object as PropType<User>,
        required: true
    },
});

const picture = ref(Blob);
const picture_url = ref(props.user.profile_picture);

const emit = defineEmits({
    openPublicationModal: (publicationId: string) => {
        return !!publicationId;
    },
    close: () => {
        return true;
    }
});

const openUploadForm = () => {
    document.getElementById("imgInput")!.click();
};
const loadPicture = (event: any) => {
    if (event.target.files[0] !== undefined) {
        URL.revokeObjectURL(picture_url.value);
        picture.value = event.target.files[0];
        picture_url.value = URL.createObjectURL(event.target.files[0]);
    }
};
</script>
  
<style scoped>
.saveButton {
    background-color: var(--hover-color);
}

.saveButton:hover {
    background-color: var(--special-text-color);
}
</style>