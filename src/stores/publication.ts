import { defineStore } from "pinia";
import { ref } from "vue"
import type { SimplifiedPublication } from "@/api/type";

export const usePublicationStore = defineStore('publication', () => {
    const publication = ref({} as SimplifiedPublication);

    const setPublication = (publicationProp: SimplifiedPublication) => {
        publication.value = publicationProp;
    };
    const getPublication = () => {
        return publication.value;
    }

    return { publication, setPublication, getPublication }
})