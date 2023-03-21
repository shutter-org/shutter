import { defineStore } from "pinia";
import { ref } from "vue"
import { deleteRatingPublication, getFollowingPublications, getPublication, ratePublication, updateRatingPublication } from "@/api/publication";
import { useUserStore } from "./user";
import { deleteRatingComment, rateComment, updateRatingComment, postComment, deleteComment, getComments } from "@/api/comment";
import type { Publication, Comment } from "@/api/type";

export const usePublicationStore = defineStore('publication', () => {
    const userStore = useUserStore();
    const homePublications = ref();
    const lastShownPublications = ref(new Map());
    const isBusy = ref(false);
    const serverPageQte = ref(12);

    const getHomePublications = () => {
        return homePublications.value;
    }
    async function loadHomePublications() {
        isBusy.value = true;
        const res = await getFollowingPublications(1, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le fetch des publications");
            isBusy.value = false;
        }
        else {
            const data = await res.json();
            homePublications.value = data.publications;
            for (let pub of data.publications) {
                lastShownPublications.value.set(pub.publication_id, pub);
            }
            isBusy.value = false;
            return data.nb_publications;
        }
    };
    async function loadMorePublications(page: number) {
        if (homePublications.value !== undefined && homePublications.value.length < page * serverPageQte.value) {
            const res = await getFollowingPublications(page, userStore.authKey);
            if (res.status !== 200) {
                console.log("erreur dans le fetch des publications");
                return undefined
            }
            else {
                const data = await res.json();
                for (let pub of data.publications) {
                    homePublications.value.push(pub);
                    lastShownPublications.value.set(pub.publication_id, pub);
                }
                return data.length !== serverPageQte.value;
            }
        }
    };

    const getShownPublication = (publicationId: string) => {
        return lastShownPublications.value.get(publicationId);
    }
    async function loadShownPublication(publicationId: string) {
        isBusy.value = true;
        const res = await getPublication(publicationId, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le fetch de la publication");
            isBusy.value = false;
        }
        else {
            const shownPublication = await res.json() as Publication;
            lastShownPublications.value.set(shownPublication.publication_id, shownPublication);
            isBusy.value = false;
            return shownPublication;
        }
    };

    //publications manipulation
    const voteUpPub = async (publicationId: string) => {
        if (!isBusy.value) {
            isBusy.value = true;
            let pub = lastShownPublications.value.get(publicationId);
            if (pub !== undefined) {
                if (pub.user_rating === 1) {
                    pub.user_rating = 0;
                    pub.rating -= 1;
                    await deleteRatingPublication(pub.publication_id, userStore.authKey);
                } else if (pub.user_rating === 0) {
                    pub.user_rating = 1;
                    pub.rating += 1;
                    await ratePublication(pub.publication_id, true, userStore.authKey);
                } else {
                    pub.user_rating = 1;
                    pub.rating += 2;
                    await updateRatingPublication(pub.publication_id, true, userStore.authKey);
                }
            }
            isBusy.value = false;
            console.log("like")
        }
    };
    const voteDownPub = async (publicationId: string) => {
        if (!isBusy.value) {
            isBusy.value = true;
            let pub = lastShownPublications.value.get(publicationId);
            if (pub !== undefined) {
                if (pub.user_rating === -1) {
                    pub.user_rating = 0;
                    pub.rating += 1;
                    await deleteRatingPublication(pub.publication_id, userStore.authKey);
                } else if (pub.user_rating === 0) {
                    pub.user_rating = -1;
                    pub.rating -= 1;
                    await ratePublication(pub.publication_id, false, userStore.authKey);
                } else {
                    pub.user_rating = -1;
                    pub.rating -= 2;
                    await updateRatingPublication(pub.publication_id, false, userStore.authKey);
                }
            }
            isBusy.value = false;
        }
    };
    const voteUpComment = async (commentId: string, publicationId: string) => {
        if (!isBusy.value) {
            isBusy.value = true;
            let pub = lastShownPublications.value.get(publicationId);
            if (pub !== undefined) {
                for (let comment of pub.comments) {
                    if (comment.comment_id === commentId) {
                        if (comment.user_rating === 1) {
                            comment.user_rating = 0;
                            comment.rating -= 1;
                            await deleteRatingComment(commentId, userStore.authKey);
                        } else if (comment.user_rating === 0) {
                            comment.user_rating = 1;
                            comment.rating += 1;
                            await rateComment(commentId, true, userStore.authKey);
                        } else {
                            comment.user_rating = 1;
                            comment.rating += 2;
                            await updateRatingComment(commentId, true, userStore.authKey);
                        }
                    }
                }
            }
            isBusy.value = false;
        }
    };
    const voteDownComment = async (commentId: string, publicationId: string) => {
        if (!isBusy.value) {
            isBusy.value = true;
            let pub = lastShownPublications.value.get(publicationId);
            if (pub !== undefined) {
                for (let comment of pub.comments) {
                    if (comment.comment_id === commentId) {
                        if (comment.user_rating === -1) {
                            comment.user_rating = 0;
                            comment.rating += 1;
                            await deleteRatingComment(commentId, userStore.authKey);
                        } else if (comment.user_rating === 0) {
                            comment.user_rating = -1;
                            comment.rating -= 1;
                            await rateComment(commentId, true, userStore.authKey);
                        } else {
                            comment.user_rating = -1;
                            comment.rating -= 2;
                            await updateRatingComment(commentId, true, userStore.authKey);
                        }
                    }
                }
            }
            isBusy.value = false;
        }
    };
    async function addComment(publicationId: string, message: string) {
        let pub = lastShownPublications.value.get(publicationId);
        if (pub !== undefined) {
            const res = await postComment(pub.publication_id, message, userStore.authKey);
            if (res.status !== 201) {
                console.log("erreur dans la creation du commentaire");
            }
            else {
                if (pub.nb_comments < 12 ||
                    (pub.comments.length === pub.nb_comments && Math.floor(pub.nb_comments / serverPageQte.value) !== 0)) {
                    const data = await res.json();
                    const newCom = {
                        comment_id: data.comment_id,
                        commenter_user: {
                            "username": userStore.username,
                            "profile_picture": userStore.profile_picture
                        },
                        message: message,
                        created_date: "now",
                        rating: 0,
                        user_rating: 0,
                    } as Comment;
                    pub.comments.push(newCom);
                }
                pub.nb_comments += 1;
            }
        }
    };
    const delComment = (publicationId: string, commentId: string) => {
        let pub = lastShownPublications.value.get(publicationId);
        if (pub !== undefined) {
            deleteComment(commentId, userStore.authKey);
            pub.comments = pub.comments.filter((comment: Comment) => {
                return comment.comment_id !== commentId;
            });
        }
    };
    async function getMoreComments(publicationId: String, page: number) {
        let pub = lastShownPublications.value.get(publicationId);
        if (pub !== undefined) {
            if (pub.comments.length < page * serverPageQte.value) {
                const res = await getComments(pub.publication_id, page, userStore.authKey);
                if (res.status !== 200) {
                    console.log("erreur dans le fetch des commentaires");
                }
                else {
                    const data = await res.json() as Comment[];
                    for (let com of data.splice(pub.comments.length - (page - 1) * serverPageQte.value, data.length)) {
                        pub.comments.push(com);
                    }
                }
            }
        }
    };

    const reset = () => {
        homePublications.value = undefined;
        lastShownPublications.value = new Map();
    }

    return {
        getHomePublications, loadHomePublications, loadMorePublications, getShownPublication, reset, serverPageQte,
        loadShownPublication, voteUpPub, voteDownPub, voteUpComment, voteDownComment, addComment, delComment, getMoreComments
    }
})