<template>
    <div
        class="shutter-modal-color flex flex-col gap-4 items-center rounded-lg p-4 relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">

        <!-- User identifications -->
        <div class="flex flex-row items-center justify-between w-full">
            <User class="h-14 mr-auto" :user="userStore.getSimplifiedUser()"></User>
        </div>

        <!-- Picture -->
        <ImgLoader id="picture" :src="publication.picture" alt=""
            class="w-full aspect-square object-cover rounded-lg stack" />

        <!-- Multiline text input (description, tags) -->
        <textarea
            class="inputable shutter-border-color shutter-background-color h-36 w-full text-xl p-2 border-2 rounded-lg"
            placeholder="Description..." maxlength="200" v-model="desc" />
        <textarea
            class="inputable shutter-border-color shutter-background-color tags h-32 w-full text-xl p-2 border-2 rounded-lg"
            placeholder="Tags..." maxlength="160" v-model="tags" />

        <p class="text-lg inline h-7 items-center text-red-500">{{ errorMessage }}</p>

        <!-- Save button -->
        <button @click="save" class="modalButton text-xl p-2 rounded-lg pr-10 pl-10">
            Save
        </button>
    </div>
</template>
  
<script setup lang="ts">
import User from "@/components/userComponents/UserComponent.vue";
import ImgLoader from "../ImgLoader.vue";
import { ref, type PropType } from "vue";
import { useUserStore } from '@/stores/user'
import type { Publication, SimplifiedUser as UserType } from "@/api/type";

const props = defineProps({
    publication: {
        type: Object as PropType<Publication>,
        required: true,
    },
});

const userStore = useUserStore();
const desc = ref(props.publication.description);
const tags = ref("#" + props.publication.tags.join(" #"));
const errorMessage = ref("");

const emit = defineEmits({
    save: (description: string, tags: string[]) => {
        return !!description;
    },
});

const save = () => {
    if (desc.value !== "") {
        let tagsArray = tags.value
            .replace(/\s/g, "")
            .split("#")
            .slice(1)
            .filter((tag) => tag.length <= 50);

        emit('save', desc.value, tagsArray);
    }
    else {
        errorMessage.value = "The description must not be empty";
        setTimeout(() => errorMessage.value = "", 3000);
    }
};
</script>