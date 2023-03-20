import { defineStore } from "pinia";
import { ref } from "vue"
import type { Publication, SimplifiedPublication, Comment } from "@/api/type";
import { deleteRatingPublication, getFollowingPublications, getPublication, ratePublication, updateRatingPublication } from "@/api/publication";
import { useUserStore } from "./user";
import { deleteRatingComment, rateComment, updateRatingComment, postComment, deleteComment, getComments } from "@/api/comment";

export const usePublicationStore = defineStore('publication', () => {
    const userStore = useUserStore();
    const homePublications = ref();
    const lastShownPublications = ref([] as Publication[]);

    const getHomePublications = () => {
        return homePublications.value;
    }
    async function loadHomePublications() {
        const res = await getFollowingPublications(1, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le fetch des publications");
        }
        else {
            homePublications.value = await res.json();
        }
    };
    async function loadMorePublications(page: number) {
        if (homePublications.value.length < page * 10) {
            const res = await getFollowingPublications(page, userStore.authKey);
            if (res.status !== 200) {
                console.log("erreur dans le fetch des publications");
                return undefined
            }
            else {
                const data = await res.json() as Publication[];
                for (let pub of data.splice(homePublications.value.length - (page - 1) * 10, data.length)) {
                    homePublications.value.push(pub);
                }
                return data.length !== 10;
            }
        }
    };

    const getShownPublication = (publicationId: string) => {
        for (let pub of lastShownPublications.value) {
            if (pub.publication_id === publicationId) {
                return pub;
            }
        }
        return undefined;
    }
    async function loadShownPublication(publicationId: string) {
        const res = await getPublication(publicationId, userStore.authKey);
        if (res.status !== 200) {
            console.log("erreur dans le fetch de la publication");
        }
        else {
            const shownPublication = await res.json();
            lastShownPublications.value.push(shownPublication);
            return shownPublication;
        }
    };

    const getAllPublications = () => {
        if (homePublications.value !== undefined) {
            return homePublications.value.concat(lastShownPublications.value);
        }
        return lastShownPublications.value;
    }

    //publications manipulation
    const voteUpPub = (publicationId: string) => {
        for (let pub of getAllPublications()) {
            if (pub.publication_id === publicationId) {
                pub.rating -= pub.user_rating;
                if (pub.user_rating === 1) {
                    pub.user_rating = 0;
                    deleteRatingPublication(pub.publication_id, userStore.authKey);
                } else if (pub.user_rating === 0) {
                    pub.user_rating = 1;
                    ratePublication(pub.publication_id, true, userStore.authKey);
                } else {
                    pub.user_rating = 1;
                    updateRatingPublication(pub.publication_id, true, userStore.authKey);
                }
                pub.rating += pub.user_rating;
            }
        }
    };
    const voteDownPub = (publicationId: string) => {
        for (let pub of getAllPublications()) {
            if (pub.publication_id === publicationId) {
                pub.rating -= pub.user_rating;
                if (pub.user_rating === -1) {
                    pub.user_rating = 0;
                    deleteRatingPublication(pub.publication_id, userStore.authKey);
                } else if (pub.user_rating === 0) {
                    pub.user_rating = -1;
                    ratePublication(pub.publication_id, false, userStore.authKey);
                } else {
                    pub.user_rating = -1;
                    updateRatingPublication(pub.publication_id, false, userStore.authKey);
                }
                pub.rating += pub.user_rating;
            }
        }
    };
    const voteUpComment = (commentId: string, publicationId: string) => {
        for (let pub of getAllPublications()) {
            if (pub.publication_id === publicationId) {
                for (let comment of pub.comments) {
                    if (comment.comment_id === commentId) {
                        comment.rating -= comment.user_rating;
                        if (comment.user_rating === 1) {
                            comment.user_rating = 0;
                            deleteRatingComment(commentId, userStore.authKey);
                        } else if (comment.user_rating === 0) {
                            comment.user_rating = 1;
                            rateComment(commentId, true, userStore.authKey);
                        } else {
                            comment.user_rating = 1;
                            updateRatingComment(commentId, true, userStore.authKey);
                        }
                        comment.rating += comment.user_rating;
                    }
                }
            }
        }
    };
    const voteDownComment = (commentId: string, publicationId: string) => {
        for (let pub of getAllPublications()) {
            if (pub.publication_id === publicationId) {
                for (let comment of pub.comments) {
                    if (comment.comment_id === commentId) {
                        comment.rating -= comment.user_rating;
                        if (comment.user_rating === -1) {
                            comment.user_rating = 0;
                            deleteRatingComment(commentId, userStore.authKey);
                        } else if (comment.user_rating === 0) {
                            comment.user_rating = -1;
                            rateComment(commentId, false, userStore.authKey);
                        } else {
                            comment.user_rating = -1;
                            updateRatingComment(commentId, false, userStore.authKey);
                        }
                        comment.rating += comment.user_rating;
                    }
                }
            }
        }
    };
    async function addComment(publicationId: string, message: string) {
        for (let pub of getAllPublications()) {
            if (pub.publication_id === publicationId) {
                const res = await postComment(pub.publication_id, message, userStore.authKey);
                if (res.status !== 201) {
                    console.log("erreur dans la creation du commentaire");
                }
                else {
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
                    pub.nb_comments += 1;
                }
            }
        }
    };
    const delComment = (publicationId: string, commentId: string) => {
        for (let pub of getAllPublications()) {
            if (pub.publication_id === publicationId) {
                deleteComment(commentId, userStore.authKey);
                pub.comments = pub.comments.filter((comment: Comment) => {
                    return comment.comment_id !== commentId;
                });
            }
        }
    };
    async function getMoreComments(publicationId: String, page: number) {
        for (let pub of getAllPublications()) {
            if (pub.publication_id === publicationId) {
                if (pub.comments.length < page * 10) {
                    const res = await getComments(pub.publication_id, page, userStore.authKey);
                    if (res.status !== 200) {
                        console.log("erreur dans le fetch des commentaires");
                    }
                    else {
                        const data = await res.json() as Comment[];
                        for (let com of data.splice(pub.comments.length - (page - 1) * 10, data.length)) {
                            pub.comments.push(com);
                        }
                    }
                }
            }
        }
    };

    return {
        getHomePublications, loadHomePublications, loadMorePublications, getShownPublication,
        loadShownPublication, voteUpPub, voteDownPub, voteUpComment, voteDownComment, addComment, delComment, getMoreComments
    }
})