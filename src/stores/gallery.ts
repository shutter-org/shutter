import { defineStore } from "pinia";
import { deleteRatingGallery, getGallery, rateGallery, updateRateGallery, deleteGalleryApi, deletePublicationFromGalleryApi, addPublicationToGalleryApi, updateGalleryApi, createGalleryApi } from "@/api/gallery";
import { getUser } from "@/api/user";
import { useUserStore } from "./user";
import type { Gallery, SimplifedGallery, User , SimplifiedPublication, GalleryParameters} from "@/api/type";
import { ref } from "vue";

export const useGalleryStore = defineStore('gallery', () => {

    const userStore = useUserStore();
    const userGalleries = ref(new Map<string, Gallery>());
    const shownGalleriesPicking = ref([] as SimplifedGallery[]);
    const isRating = ref(false);

    async function getAGallery(gallery_id: string){
        const res = await getGallery(gallery_id, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le fetch de la gallery");
        }
        else {
            const shownGallery = await res.json() as Gallery;
            return shownGallery;
        }
    }
    function getUserGalleries() {
        const galleriesArray = Array.from(userGalleries.value.values());
        galleriesArray.sort((a, b) => {
          const dateA = getDateFromString(a.created_date);
          const dateB = getDateFromString(b.created_date);
          if (dateA && dateB) {
            return dateB.getTime() - dateA.getTime();
          }
          return 0;
        });
        return galleriesArray;
    }
    function getDateFromString(dateString:string) {
        if (dateString === 'now') {
            return new Date();
          }
        const regex = /^(\d+) (\w+) ago$/;
        const matches = regex.exec(dateString);
        if (matches) {
          const amount = parseInt(matches[1]);
          const unit = matches[2];
          const now = new Date();
          switch (unit) {
            case 'minutes':
              return new Date(now.getTime() - amount * 60 * 1000);
            case 'hours':
              return new Date(now.getTime() - amount * 60 * 60 * 1000);
            case 'days':
              return new Date(now.getTime() - amount * 24 * 60 * 60 * 1000);
            case 'weeks':
              return new Date(now.getTime() - amount * 7 * 24 * 60 * 60 * 1000);
            case 'months':
              return new Date(now.getFullYear(), now.getMonth() - amount, now.getDate());
            case 'years':
              return new Date(now.getFullYear() - amount, now.getMonth(), now.getDate());
            default:
              return null;
          }
        } else {
          return null;
        }
    }
      
    function updateUserGalleries(galleries: Map<string, Gallery>){
        userGalleries.value = galleries;
    }
    function setGallery(gallery: Gallery){
        userGalleries.value.set(gallery.gallery_id, gallery);
    }
    function removeFromUserGalleries(gallery_id: string){
        userGalleries.value.delete(gallery_id);
    }
    function getGalleryFromUserGalleries(gallery_id: string){
        return userGalleries.value.get(gallery_id);
    }
    async function getSimplifiedGalleries(){
        const res = await getUser(userStore.username, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le fetch de l'utilisateur pour get les galleries");
        }else{
            const user = await res.json() as User;
            shownGalleriesPicking.value = user.galleries;
        }
        return shownGalleriesPicking.value;
    }
    async function addPublicationToGallery(gallery: Gallery, publication: SimplifiedPublication){
        const res = await addPublicationToGalleryApi(gallery.gallery_id, publication.publication_id, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le fetch de l'utilisateur pour get les galleries");
        }else{
            const simplifiedPublication = {
                publication_id: publication.publication_id,
                picture: publication.picture,
            } as SimplifiedPublication;
            gallery.publications.push(simplifiedPublication);
            setGallery(gallery);
            return true;
        }
    }
    async function deletePublicationFromGallery(gallery: Gallery, publication_id: string, ) {
        const res = await deletePublicationFromGalleryApi(gallery.gallery_id, publication_id, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le delete de la publication de la gallery");
        }else{
            gallery.publications = gallery.publications.filter((publication) => publication.publication_id !== publication_id);
            setGallery(gallery);
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
            removeFromUserGalleries(gallery.gallery_id)
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
            setGallery(await resGallery.json() as Gallery);
            shownGalleriesPicking.value = [];
            return true;
        }
    }
    async function updateGallery(gallery_id:string, gallery_parameters: GalleryParameters) {
        const res = await updateGalleryApi(gallery_id, gallery_parameters.title, gallery_parameters.description, gallery_parameters.private, userStore.authKey);
        if(res.status !== 200){
            console.log("erreur dans le update de la gallery");
        }else{
            let gallery = getGalleryFromUserGalleries(gallery_id) as Gallery;
            gallery = { ...gallery, ...gallery_parameters };
            setGallery(gallery);
            return true;
        }
    }
    function removePublicationFromGallery(publication_id: string) {
        for (let gallery of userGalleries.value.values()) {
          for (let j = 0; j < gallery.publications.length; j++) {
            if (gallery.publications[j].publication_id === publication_id) {
            console.log(gallery)
              gallery.publications.splice(j, 1);
              console.log(gallery)
              setGallery(gallery);
              return; 
            }
          }
        }
      }
      
    function reset(){
        userGalleries.value.clear();
        shownGalleriesPicking.value = [];
    }
    return { getAGallery,getGalleryFromUserGalleries, voteDownGallery,removeFromUserGalleries, setGallery, voteUpGallery, deleteGallery, deletePublicationFromGallery, getSimplifiedGalleries, addPublicationToGallery, updateUserGalleries, getUserGalleries, createGallery, updateGallery, reset, removePublicationFromGallery }
})
