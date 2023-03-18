import { defineStore } from "pinia";
import { ref } from "vue"
import type { Publication } from "@/api/type";

export const usePublicationStore = defineStore('publication', () => {
    const publication = ref({} as Publication);

    const setPublication = (publicationProp: Publication) => {
        publication.value = publicationProp;
    };
    const getPublication = () => {
        return publication.value;
    }

    return { publication, setPublication, getPublication }
})