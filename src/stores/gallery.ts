import { defineStore } from "pinia";
import { deleteRatingGallery, getGallery, rateGallery, updateRateGallery } from "@/api/gallery";
import { useUserStore } from "./user";
import type { Gallery } from "@/api/type";

export const useGalleryStore = defineStore('gallery', () => {

    const userStore = useUserStore();

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

        gallery.rating -= gallery.username_rating;
        if(gallery.username_rating == 1){
            if (gallery.username_rating === 1) {
                gallery.username_rating = 0;
                deleteRatingGallery(gallery.gallery_id, userStore.authKey);
            } else if (gallery.username_rating === 0) {
                gallery.username_rating = 1;
                rateGallery(gallery.gallery_id, true, userStore.authKey);
            } else {
                gallery.username_rating = 1;
                updateRateGallery(gallery.gallery_id, true, userStore.authKey);
            }
            gallery.rating += gallery.username_rating;
        }
    }
    async function voteUpGallery(gallery: Gallery){
        console.log('upvote gallery')
        gallery.rating -= gallery.username_rating;
        if (gallery.username_rating === 1) {
            gallery.username_rating = 0;
            deleteRatingGallery(gallery.gallery_id, userStore.authKey);
        } else if (gallery.username_rating === 0) {
            gallery.username_rating = 1;
            rateGallery(gallery.gallery_id, true, userStore.authKey);
        } else {
            gallery.username_rating = 1;
            updateRateGallery(gallery.gallery_id, true, userStore.authKey);
        }
        gallery.rating += gallery.username_rating;
    }
    async function deleteGallery(gallery: Gallery){
        console.log('delete gallery')
    }
    return { getShownGallery, voteDownGallery, voteUpGallery, deleteGallery }
})