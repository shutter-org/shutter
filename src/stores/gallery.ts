import { defineStore } from "pinia";
import { deleteRatingGallery, getGallery, rateGallery, updateRateGallery, deleteGalleryApi, deletePublicationFromGalleryApi, addPublicationToGalleryApi, updateGalleryApi, createGalleryApi } from "@/api/gallery";
import { getUser } from "@/api/user";
import { useUserStore } from "./user";
import type { Gallery, SimplifedGallery, User , SimplifiedPublication, GalleryParameters} from "@/api/type";
import { ref } from "vue";

export const useGalleryStore = defineStore('gallery', () => {

    const userStore = useUserStore();
    const userGalleries = ref([] as Gallery[]);
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
    function getUserGalleries(){
        return userGalleries.value;
    }
    function updateUserGalleries(galleries: Gallery[]){
        userGalleries.value = galleries;
    }
    async function getSimplifiedGalleries(){
        if (shownGalleriesPicking.value !== undefined){
                const res = await getUser(userStore.username, userStore.authKey);
                if (res.status !== 200) {
                    console.log("erreur dans le fetch de l'utilisateur pour get les galleries");
                }else{
                    const user = await res.json() as User;
                    shownGalleriesPicking.value = user.galleries;
                }
                return shownGalleriesPicking.value;
        }
        return shownGalleriesPicking.value;
    }
    async function addPublicationToGallery( gallery_id: string, publication: SimplifiedPublication){
        const res = await addPublicationToGalleryApi(gallery_id, publication.publication_id, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le fetch de l'utilisateur pour get les galleries");
        }else{
            for (let i = 0; i < userGalleries.value.length; i++){
                if (userGalleries.value[i].gallery_id === gallery_id){
                    userGalleries.value[i].publications.push(publication);
                }
            }
            return true;
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
        const res = await deleteGalleryApi(gallery.gallery_id, userStore.authKey);
        if(res.status !== 200){
            console.log("erreur dans le delete de la gallery");
        }else{
            for (let i = 0; i < userGalleries.value.length; i++){
                if (userGalleries.value[i].gallery_id === gallery.gallery_id){
                    userGalleries.value.splice(i, 1);
                }
            }
            return true;
        }
    }
    async function deletePublicationFromGallery(gallery_id: string, publication_id: string) {
        const res = await deletePublicationFromGalleryApi(gallery_id, publication_id, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le delete de la publication de la gallery");
        }else{
            for (let i = 0; i < userGalleries.value.length; i++){
                if (userGalleries.value[i].gallery_id === gallery_id){
                    for (let j = 0; j < userGalleries.value[i].publications.length; j++){
                        if (userGalleries.value[i].publications[j].publication_id === publication_id){
                            userGalleries.value[i].publications.splice(j, 1);
                        }
                    }
                }
            }
            return true;
        }
    }
    async function createGallery(gallery_parameters:GalleryParameters) {
        const res = await createGalleryApi(gallery_parameters.title, gallery_parameters.description, gallery_parameters.private, userStore.authKey);
        if(res.status !== 201){
            console.log("erreur dans le create de la gallery");
        }else{
            const gallery_id = await res.json();
            const resGallery = await getGallery(gallery_id.gallery_id, userStore.authKey);
            const gallery = await resGallery.json() as Gallery;
            userGalleries.value.unshift(gallery);
            return true;
        }
    }
    async function updateGallery(gallery_id:string, gallery_parameters: GalleryParameters) {
        const res = await updateGalleryApi(gallery_id, gallery_parameters.title, gallery_parameters.description, gallery_parameters.private, userStore.authKey);
        if(res.status !== 200){
            console.log("erreur dans le update de la gallery");
        }else{
            for (let i = 0; i < userGalleries.value.length; i++){
                if (userGalleries.value[i].gallery_id === gallery_id){
                    userGalleries.value[i].title = gallery_parameters.title;
                    userGalleries.value[i].description = gallery_parameters.description;
                    userGalleries.value[i].private = gallery_parameters.private;
                }
            }
            return true;
        }
        
    }
    function reset(){
        userGalleries.value = [];
        shownGalleriesPicking.value = [];
    }
    return { getShownGallery, voteDownGallery, voteUpGallery, deleteGallery, deletePublicationFromGallery, getSimplifiedGalleries, addPublicationToGallery, updateUserGalleries, getUserGalleries, createGallery, updateGallery, reset }
})