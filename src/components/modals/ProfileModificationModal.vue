<template>
    <div class="fixed inset-0 z-50 flex justify-center items-center">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')">
        </div>
        <div
            class="post flex flex-col gap-4 items-center rounded-lg p-4 relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
            <div
                class="modal shutter-border-color shutter-background-color w-full flex flex-col gap-2 items-center rounded-lg p-4">
                <div class="w-full h-48 PRO:h-80 flex flex-row PRO:flex-col gap-10 PRO:gap-4 items-center p-2">

                    <!-- Picture uploader -->
                    <button class="h-full PRO:h-1/2 aspect-square rounded-full border-2 grid grid-cols-1 grid-rows-1"
                        @click="openUploadForm">
                        <ImgLoader id="picture" class="h-full w-full object-cover aspect-square rounded-full stack"
                            :src="picture_url" :round="true" />
                        <div class="w-full aspect-square stack z-50 shadowback rounded-full flex justify-center">
                            <ImageIcon class="w-1/2 aspect-square inputableImage"></ImageIcon>
                        </div>
                    </button>
                    <input class="hidden" type="file" id="imgInput" name="img" accept="image/*" @change="loadPicture" />

                    <!-- Inline text modifications (username, name) -->
                    <div class="h-full w-full flex flex-col gap-4 justify-center overflow-x-auto p-1">
                        <input class="w-full font-bold text-4xl inputable p-2 border-2 rounded-lg" placeholder="Username..."
                            maxlength="50" v-model="username" />
                        <div class="w-full flex flex-row PRO:justify-center">
                            <input class="w-full font-bold text-2xl inputable p-2 border-2 rounded-lg" placeholder="Name..."
                                maxlength="50" v-model="name" />
                            <p class="w-max font-bold text-2xl p-2 inline whitespace-nowrap">
                                • {{ props.user.age }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Multiline text modification (biography) -->
                <div class="w-full h-full p-3 pb-2">
                    <textarea id="bioElement" class="inputable w-full max-h-48 text-xl p-2 border-2 rounded-lg"
                        placeholder="Biography..." maxlength="200" v-model="bio"
                        oninput='this.style.height = "";this.style.height = this.scrollHeight + 4 + "px"'
                        @keydown="preventNextLine" />
                </div>

                <!-- save button -->
                <button class="text-xl p-2 rounded-lg pr-10 pl-10 saveButton"
                    @click="emit('save', picture, picture_url, username, name, bio)">save</button>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import ImgLoader from "../ImgLoader.vue";
import ImageIcon from "@/components/icons/ImageIcon.vue";
import { onMounted, ref } from "vue";
import type { User } from "@/api/type";
import type { PropType } from "vue";

const props = defineProps({
    user: {
        type: Object as PropType<User>,
        required: true
    },
});

const picture = ref();
const picture_url = ref(props.user.profile_picture);
const username = ref(props.user.username);
const name = ref(props.user.name);
const bio = ref(props.user.biography);

const emit = defineEmits({
    openPublicationModal: (publicationId: string) => {
        return !!publicationId;
    },
    save: (picture: Blob, picture_url: string, username: string, name: string, bio: string) => {
        return !!picture_url && !!username && !!name;
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
const preventNextLine = (event: KeyboardEvent) => {
    if (event.key == "Enter") {
        event.preventDefault();
    }
};

onMounted(() => {
    let bioElement = document.getElementById("bioElement")!;
    bioElement.style.height = "";
    bioElement.style.height = bioElement.scrollHeight + 4 + "px";
})
</script>
  
<style scoped>
.modal {
    background-color: var(--modal-color);
}

.saveButton {
    background-color: var(--hover-color);
}

.saveButton:hover {
    background-color: var(--color-border);
}

.inputable {
    border-color: var(--color-border);
    background-color: var(--color-background);
    box-shadow: none;
    resize: none;
}

.stack {
    grid-row: 1;
    grid-column: 1;
}

.inputableImage {
    color: rgba(255, 255, 255, 0.3);

}

.shadowback {
    background-color: rgba(0, 0, 0, 0.3);
}
</style>