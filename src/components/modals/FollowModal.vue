<template>
    <div class="fixed inset-0 z-50 flex justify-center items-center">

        <!-- Gray background -->
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full" @click="emit('close')"></div>

        <!-- Modal -->
        <div
            class="shutter-modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-lg PRO:mx-4 translate-x-[126px] PRO:translate-x-0">
            <div class="rounded-lg items-center flex flex-col relative max-w-full">
                <p class="text-2xl font-bold p-2 mb-2">{{ title }}</p>
                <UpvoteIcon v-if="!isAtStart" class="w-full h-8 border-b-2 shutter-border-color" />
                <div @scroll="handleScroll" id="userContainer"
                    class="rounded-lg items-center flex flex-col w-full max-h-80 overflow-y-scroll">
                    <UserBarComponent v-for="user of follows" :user="user" :key="user.username">
                    </UserBarComponent>
                </div>
                <DownvoteIcon v-if="!isAtEnd && !isBusy" class="w-full h-8 border-t-2 shutter-border-color" />

                <!-- Spinner showing loading more post status -->
                <SkewLoader v-if="isBusy" color="#465A82" size="10px" class="m-full h-8" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import UserBarComponent from '../userComponents/UserBarComponent.vue';
import SkewLoader from "vue-spinner/src/SkewLoader.vue";
import DownvoteIcon from '../icons/rate/DownvoteIcon.vue';
import UpvoteIcon from '../icons/rate/UpvoteIcon.vue';
import { useUserStore } from "@/stores/user";
import type { SimplifiedUser, SimplifiedUserWithName } from '@/api/type';
import { onMounted, ref, type PropType } from 'vue';

const props = defineProps({
    users: {
        type: Object as PropType<SimplifiedUser[]>,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    nb_follows: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

const emit = defineEmits(["close"]);

const userStore = useUserStore();
const follows = ref(props.users as SimplifiedUserWithName[]);
const nextPage = ref(2);
const isBusy = ref(false);
const isAtStart = ref(true);
const isAtEnd = ref(false);

const loadMoreFollows = async () => {
    if (!isBusy.value) {
        isBusy.value = true;
        if (props.users.length < props.nb_follows) {
            console.log("loading more follows")
            await userStore.loadMoreFollows(props.username, props.title, nextPage.value);
            nextPage.value += 1;
        }
        isBusy.value = false;
    }
}
const handleScroll = () => {
    let container = document.getElementById("userContainer")!;

    if ((container.offsetHeight + container.scrollTop + 200) >= container.scrollHeight) {
        loadMoreFollows();
    }

    if ((container.offsetHeight + container.scrollTop) >= container.scrollHeight) {
        isAtEnd.value = true;
        container.classList.add("mb-8");
    }
    else {
        isAtEnd.value = false;
        container.classList.remove("mb-8");
    }

    if (container.scrollTop === 0) {
        isAtStart.value = true;
        container.classList.add("mt-8");
    }
    else {
        isAtStart.value = false;
        container.classList.remove("mt-8");
    }
}

onMounted(() => { handleScroll(); })
</script>