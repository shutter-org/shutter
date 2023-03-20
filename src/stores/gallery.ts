import { defineStore } from "pinia";
import { getGallery } from "@/api/gallery";
import { useUserStore } from "./user";
import type { Gallery, Publication } from "@/api/type";
import {ref } from "vue"
import { getPublication } from "@/api/publication";

export const useGalleryStore = defineStore('gallery', () => {

    async function getShownGallery(gallery_id: string){
        const res = await getGallery(gallery_id, useUserStore().authKey);
        if (res.status !== 200) {
            console.log("erreur dans le fetch de la gallery");
        }
        else {
            const shownGallery = await res.json() as Gallery;
            return shownGallery;
        }
    }
    return { getShownGallery}
})