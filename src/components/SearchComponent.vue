<template>
    <div class="rounded-lg items-center flex flex-col relative max-w-full">

        <!-- Search input -->
        <div
            class="mb-5 w-full rounded-md h-12 border-2 shutter-background-color shutter-border-color pl-4 self-center flex items-center">
            <input class="z-2 outline-none shutter-background-color box-border h-11 w-full" v-focus v-model="search"
                placeholder="Search users or tags with '#'" @keydown.up.prevent="highlightPrevious"
                @keydown.down.prevent="highlightNext" @keydown.enter="enterPressed(highlightedIndex)" />
            <CrossIcon class="h-6 pr-2" @click="emptySearch" />
        </div>

        <!-- Searched users -->
        <UserBarComponentVue v-for="(user, index) in usersSearched?.slice(0, 6)" v-if="isSearchingUsers" :user="user"
            :key="index" class="PRO:h-12" :class="{ 'shutter-hover-color': isCurrentIndex(index) }"
            @mouseover="highlightedIndex = index" @click="emit('closeSearchModal')"
            @close-search-modal="emit('closeSearchModal')"></UserBarComponentVue>

        <!-- Searched tags -->
        <router-link :to="'/explore/' + tag.tag" class="w-full rounded-md disable-hover PRO:h-12"
            :class="{ 'shutter-hover-color': isCurrentIndex(index) }" v-for="(tag, index) in tagsSearched?.slice(0, 6)"
            :key="index" v-if="!isSearchingUsers" @click="emit('closeSearchModal')" @mouseover="highlightedIndex = index">
            <div class="py-3 px-1 h-14 flex flex-row items-center">
                <div class="w-10 h-10 rounded-full mr-8 border border-slate-400 flex justify-center items-center">
                    <div class="w-5 h-5">
                        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path clip-rule="evenodd" fill-rule="evenodd"
                                d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z">
                            </path>
                        </svg>
                    </div>
                </div>
                <div class="flex flex-col">
                    <span class="font-bold">#{{ tag.tag }}</span>
                    <span class="text-sm">{{ tag.nb_publications }} posts</span>
                </div>
            </div>
        </router-link>
    </div>
</template>
<script setup lang="ts">
import CrossIcon from './icons/CrossIcon.vue';
import UserBarComponentVue from './userComponents/UserBarComponent.vue';
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { searchUser } from '@/api/user';
import { searchTag } from '@/api/tag';
import { ref, watch } from 'vue';

const search = ref("");
const userStore = useUserStore();
const usersSearched = ref();
const tagsSearched = ref();
const isSearchingUsers = ref(true);
const highlightedIndex = ref(-1);



loadSearchedUser("");


watch(search, (newValue, oldValue) => {
    filterSearch(newValue);
});

function emptySearch() {
    search.value = "";
    loadSearchedUser("");
}
function highlightPrevious() {
    if (highlightedIndex.value > 0) {
        highlightedIndex.value--;
    }
}
function highlightNext() {
    if (isSearchingUsers.value) {
        if (highlightedIndex.value < usersSearched.value.length - 1) {
            highlightedIndex.value++;
        }
    } else {
        if (highlightedIndex.value < tagsSearched.value.length - 1) {
            highlightedIndex.value++;
        }
    }
}
function isCurrentIndex(index: number) {
    return highlightedIndex.value === index;
}

function filterSearch(search: string) {
    highlightedIndex.value = -1;
    if (search.startsWith("#")) {
        isSearchingUsers.value = false;
        loadSearchedTags(search.substring(1));
    } else {
        isSearchingUsers.value = true;
        loadSearchedUser(search);
    }
}
async function loadSearchedUser(search: string) {
    const res = await searchUser(search, userStore.authKey);
    if (res.status !== 200) {
        return;
    } else {
        const data = await res.json()
        usersSearched.value = data;
    }
}
async function loadSearchedTags(search: string) {
    const res = await searchTag(search, userStore.authKey);
    if (res.status !== 200) {
        return;
    } else {
        const data = await res.json()
        tagsSearched.value = data;
    }
}
function enterPressed(index: number) {
    if (isSearchingUsers.value) {
        router.push('/user/' + usersSearched.value[index].username);
        emit('closeSearchModal')
        return;
    } else {
        router.push('/explore/' + tagsSearched.value[index].tag);
        emit('closeSearchModal');
        return;
    }
}
const vFocus = {
    mounted: (el: { focus: () => any; }) => el.focus(),
};
const emit = defineEmits(["closeSearchModal"]);

</script>