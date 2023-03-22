import { defineStore } from "pinia";
import { deleteRatingGallery, getGallery, rateGallery, updateRateGallery, deleteGalleryApi, deletePublicationFromGalleryApi } from "@/api/gallery";
import { getUser } from "@/api/user";
import { useUserStore } from "./user";
import type { Gallery, SimplifedGallery, User } from "@/api/type";
import { ref } from "vue";

export const useGalleryStore = defineStore('gallery', () => {

    const userStore = useUserStore();
    const shownGalleriesPicking = ref([] as SimplifedGallery[]);
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
    async function getSimplifiedGalleries(){
        if (shownGalleriesPicking.value !== undefined){
                const res = await getUser(userStore.username, userStore.authKey);
                if (res.status !== 200) {
                    console.log("erreur dans le fetch de l'utilisateur pour get les galleries");
                }else{
                    const user = await res.json() as User;
                    shownGalleriesPicking.value = user.gallerys;
                }
                return shownGalleriesPicking.value;
        }
        return shownGalleriesPicking.value;
    }
    async function addPublicationToGallery( gallery: SimplifedGallery, publication_id: string){
        console.log("addPublicationToGallery");
        //if status 
        // add to shownGalleryPicking
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
        const res = await deleteGalleryApi(gallery.gallery_id, userStore.authKey);
        if(res.status !== 200){
            console.log("erreur dans le delete de la gallery");
        }else{
            return true;
        }
    }
    async function deletePublicationFromGallery(gallery_id: string, publication_id: string) {
        const res = await deletePublicationFromGalleryApi(gallery_id, publication_id, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le delete de la publication de la gallery");
        }else{
            return true;
        }
    }
    return { getShownGallery, voteDownGallery, voteUpGallery, deleteGallery, deletePublicationFromGallery, getSimplifiedGalleries, addPublicationToGallery }
})