import { defineStore } from "pinia";
import { deleteRatingGallery, getGallery, rateGallery, updateRateGallery } from "@/api/gallery";
import { useUserStore } from "./user";
import type { Gallery } from "@/api/type";
import { ref } from "vue";

export const useGalleryStore = defineStore('gallery', () => {

    const userStore = useUserStore();
    const isRating = ref(false);

    async function getShownGallery(gallery_id: string){
        const res = await getGallery(gallery_id, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le fetch de la gallery");
        }
        else {
            const shownGallery = await res.json() as Gallery;
            return shownGallery;
        }
    }
    async function voteDownGallery(gallery: Gallery){
        console.log('downvote gallery')
        if (!isRating.value) {
            isRating.value = true;
            if (gallery !== undefined) {
                if (gallery.user_rating === -1) {
                    gallery.user_rating = 0;
                    gallery.rating += 1;
                    await deleteRatingGallery(gallery.gallery_id, userStore.authKey);
                } else if (gallery.user_rating === 0) {
                    gallery.user_rating = -1;
                    gallery.rating -= 1;
                    await rateGallery(gallery.gallery_id, false, userStore.authKey);
                } else {
                    gallery.user_rating = -1;
                    gallery.rating -= 2;
                    await updateRateGallery(gallery.gallery_id, false, userStore.authKey);
                }
            }
            isRating.value = false;
        }
    }
    async function voteUpGallery(gallery: Gallery){
        console.log('upvote gallery')
        if (!isRating.value) {
            isRating.value = true;
            if (gallery !== undefined) {
                if (gallery.user_rating === 1) {
                    gallery.user_rating = 0;
                    gallery.rating -= 1;
                    await deleteRatingGallery(gallery.gallery_id, userStore.authKey);
                } else if (gallery.user_rating === 0) {
                    gallery.user_rating = 1;
                    gallery.rating += 1;
                    await rateGallery(gallery.gallery_id, true, userStore.authKey);
                } else {
                    gallery.user_rating = 1;
                    gallery.rating += 2;
                    await updateRateGallery(gallery.gallery_id, true, userStore.authKey);
                }
            }
            isRating.value = false;
        }
    }
    async function deleteGallery(gallery: Gallery){
        console.log('delete gallery')
    }
    return { getShownGallery, voteDownGallery, voteUpGallery, deleteGallery }
})