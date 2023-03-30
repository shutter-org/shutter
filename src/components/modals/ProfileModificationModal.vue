<template>
    <div class="fixed inset-0 z-50 flex justify-center items-center">

        <!-- Gray background -->
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
                        <input class="w-full font-bold text-4xl inputable p-2 border-2 rounded-lg outline-none"
                            placeholder="Username..." maxlength="50" v-model="username" />
                        <div class="w-full flex flex-row PRO:justify-center">
                            <input class="w-full font-bold text-2xl inputable p-2 border-2 rounded-lg outline-none"
                                placeholder="Name..." maxlength="50" v-model="name" />
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

                <p class="text-lg inline h-7 items-center text-red-500">{{ errorMessage }}</p>

                <!-- save button -->
                <button class="text-xl p-2 rounded-lg pr-10 pl-10 saveButton" @click="save">save</button>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import ImgLoader from "../ImgLoader.vue";
import ImageIcon from "@/components/icons/ImageIcon.vue";
import { onMounted, ref, type PropType } from "vue";
import { updateUser } from "@/api/user";
import { useUserStore } from "@/stores/user";
import { useGalleryStore } from "@/stores/gallery";
import type { User } from "@/api/type";

const props = defineProps({
    user: {
        type: Object as PropType<User>,
        required: true
    },
});

const userStore = useUserStore();
const galleryStore = useGalleryStore();
const picture = ref();
const picture_url = ref(props.user.profile_picture);
const username = ref(props.user.username);
const name = ref(props.user.name);
const bio = ref(props.user.biography);
const errorMessage = ref("");

const emit = defineEmits(["close"]);

const save = async () => {
    if (username.value !== "") {
        if (name.value !== "") {
            const body = {} as User;

            const user = userStore.getShownUser(userStore.username) as User;
            async function continueSave() {
                if (user.username !== username.value) {
                    body.username = username.value;
                }
                if (user.name !== name.value) {
                    body.name = name.value;
                }
                if (user.biography !== bio.value) {
                    body.biography = bio.value;
                }

                if (Object.keys(body).length !== 0) {
                    console.log("updating user");
                    const res = await updateUser(userStore.username, userStore.authKey, body);
                    const data = await res.json();
                    if (res.status !== 200) {
                        errorMessage.value = data.Error;
                        setTimeout(() => errorMessage.value = "", 3000);
                    } else {
                        await userStore.loadShownUser(username.value) as User;
                        galleryStore.reset();
                        await galleryStore.loadGalleries(user);

                        if (data.access_token !== undefined) {
                            console.log("key changed")
                            userStore.setAuthKey(data.access_token);
                        }
                        if (data.user !== undefined && data.user !== null) {
                            if (data.user.username !== undefined) {
                                userStore.removeShownUser(userStore.username);
                                userStore.setUsername(data.user.username);
                            }
                            if (data.user.profile_picture !== undefined) {
                                userStore.setProfilePicture(data.user.profile_picture);
                            }
                        }
                        console.log('updated')
                        emit("close");
                    }
                }
                else {
                    emit("close");
                }
            }

            if (user.profile_picture !== picture_url.value) {
                const reader = new FileReader();
                reader.onload = () => {
                    body.profile_picture = reader.result as string;
                    continueSave();
                }
                reader.readAsDataURL(picture.value);
            }
            else {
                continueSave();
            }
        }
        else {
            errorMessage.value = "Name must not be empty";
            setTimeout(() => errorMessage.value = "", 3000);
        }
    }
    else {
        errorMessage.value = "Username must not be empty";
        setTimeout(() => errorMessage.value = "", 3000);
    }
}
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