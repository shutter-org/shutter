import type { Gallery, SimplifiedGalleryForPublication, GalleryParameters, User, SimplifiedPublication, } from "../api/type";
import { defineStore } from "pinia";
import { ref } from "vue";
import { createGalleryApi, getGalleryApi, deleteGalleryApi, updateGalleryApi, addPublicationToGalleryApi, deletePublicationFromGalleryApi, deleteRatingGalleryApi, updateRateGalleryApi, rateGalleryApi } from "../api/gallery";
import { getUser } from "../api/user";
import { useUserStore } from "./user";

export const useGalleryStore = defineStore("gallery", () => {
  const userStore = useUserStore();
  const isRating = ref(false);
  const galleries = ref(new Map<string, Gallery>());
  const shownGalleriesPicking = ref(
    new Map<string, SimplifiedGalleryForPublication[]>()
  );
  const galleriesIndex = ref(new Map<string, number>());

  //basic operations
  function setGalleryIndex(gallery_id: string, index: number) {
    if (galleriesIndex.value.get(gallery_id) === undefined) {
      galleriesIndex.value.set(gallery_id, index);
    }
  }
  function getGalleryIndex(gallery_id: string) {
    return galleriesIndex.value.get(gallery_id);
  }
  function addIndexToGalleryIndex(gallery_id: string, index: number) {
    if (galleriesIndex.value.get(gallery_id) !== undefined) {
      galleriesIndex.value.set(gallery_id, index);
    }
  }
  function setGalleryMap(gallery: Gallery) {
    galleries.value.set(gallery.gallery_id, gallery);
  }
  function addGalleryToMap(gallery: Gallery) {
    galleries.value.set(gallery.gallery_id, gallery);
  }
  function removeGalleryFromMap(gallery_id: string) {
    galleries.value.delete(gallery_id);
    getDateFromString("now");
  }
  function getGalleryFromMap(gallery_id: string) {
    return galleries.value.get(gallery_id);
  }
  function reset() {
    galleries.value.clear();
    shownGalleriesPicking.value.clear();
  }
  function removePublicationFromGalleryMap(
    gallery_id: string,
    publication: SimplifiedPublication
  ) {
    const gallery = getGalleryFromMap(gallery_id) as Gallery;
    if (gallery !== undefined) {
      const publications = gallery.publications;
      for (let i = 0; i < publications.length; i++) {
        if (publications[i].publication_id === publication.publication_id) {
          publications.splice(i, 1);
          break;
        }
      }
    }
    setGalleryMap(gallery);
  }
  function addPublicationToGalleryMap(
    gallery_id: string,
    publication: SimplifiedPublication
  ) {
    const gallery = getGalleryFromMap(gallery_id) as Gallery;
    if (gallery !== undefined) {
      gallery.publications.push(publication);
    }
    setGalleryMap(gallery);
  }
  //to use in components
  function getUsersGalleries(username: string) {
    const galleriesArray = Array.from(galleries.value.values());
    const userGalleries = galleriesArray.filter(
      (gallery) => gallery.creator_user.username.toLowerCase() === username.toLowerCase()
    );
    return sortGalleriesArrayByDate(userGalleries);
  }
  //call to apis
  async function loadGalleries(user: User) {
    for (let i = 0; i < user.galleries.length; i++) {
      const res = await getGalleryApi(
        user.galleries[i].gallery_id,
        userStore.authKey
      );
      if (res.status !== 200) {
        console.log("erreur dans le fetch de la gallery : loadGalleries");
      } else {
        const gallery = (await res.json()) as Gallery;
        addGalleryToMap(gallery);
      }
    }
  }

  async function createGallery(galleryParameters: GalleryParameters) {
    const res = await createGalleryApi(
      galleryParameters.title,
      galleryParameters.description,
      galleryParameters.private,
      userStore.authKey
    );
    if (res.status !== 201) {
      console.log("erreur dans le create de la gallery");
    } else {
      const gallery_idJson = await res.json();
      const resGallery = await getGalleryApi(
        gallery_idJson.gallery_id,
        userStore.authKey
      );
      if (resGallery.status !== 200) {
        console.log("erreur dans le fetch de la gallery");
      } else {
        const gallery = (await resGallery.json()) as Gallery;
        console.log(gallery);
        addGalleryToMap(gallery);
        return true;
      }
    }
  }
  async function deleteGallery(gallery_id: string) {
    const res = await deleteGalleryApi(gallery_id, userStore.authKey);
    if (res.status !== 200) {
      console.log("erreur dans le delete de la gallery");
    } else {
      removeGalleryFromMap(gallery_id);
      return true;
    }
  }
  async function updateGallery(
    gallery_id: string,
    galleryParameters: GalleryParameters
  ) {
    const res = await updateGalleryApi(
      gallery_id,
      galleryParameters.title,
      galleryParameters.description,
      galleryParameters.private,
      userStore.authKey
    );
    if (res.status !== 200) {
      console.log("erreur dans le update de la gallery");
    } else {
      //update parameter of gallery in map with gallery_id
      let gallery = getGalleryFromMap(gallery_id) as Gallery;
      gallery = { ...gallery, ...galleryParameters };
      setGalleryMap(gallery);
      return true;
    }
  }

  async function addPublicationToGallery(gallery_id: string, publication: SimplifiedPublication) {
    const res = await addPublicationToGalleryApi(
      gallery_id,
      publication.publication_id,
      userStore.authKey
    );
    if (res.status !== 200) {
      console.log("erreur dans le add de la publication à la gallery");
    } else {
      if (galleries.value.size !== 0) {
        addPublicationToGalleryMap(gallery_id, publication);
      }

      return true;
    }
  }
  async function removePublicationFromGallery(gallery_id: string, publication: SimplifiedPublication) {
    const res = await deletePublicationFromGalleryApi(
      gallery_id,
      publication.publication_id,
      userStore.authKey
    );
    if (res.status !== 200) {
      console.log("erreur dans le delete de la publication de la gallery");
    } else {
      if (galleries.value.size !== 0) {
        removePublicationFromGalleryMap(gallery_id, publication);
      }
      return true;
    }
  }
  function removePublicationFromGalleryWithOnlyPublication(publication_id: string) {
    const galleriesArray = Array.from(galleries.value.values());
    galleriesArray.forEach((gallery) => {
      const index = gallery.publications.findIndex(
        (publication) => publication.publication_id === publication_id
      );
      if (index !== -1) {
        gallery.publications.splice(index, 1);
      }
    });
    galleries.value.clear();
    galleriesArray.forEach((gallery) => {
      galleries.value.set(gallery.gallery_id, gallery);
    });
  }

  async function voteDownGallery(gallery: Gallery) {
    console.log("upvote gallery");
    if (!isRating.value) {
      isRating.value = true;
      if (gallery !== undefined) {
        if (gallery.user_rating === 1) {
          gallery.user_rating = 0;
          gallery.rating -= 1;
          await deleteRatingGalleryApi(gallery.gallery_id, userStore.authKey);
        } else if (gallery.user_rating === 0) {
          gallery.user_rating = 1;
          gallery.rating += 1;
          await rateGalleryApi(gallery.gallery_id, true, userStore.authKey);
        } else {
          gallery.user_rating = 1;
          gallery.rating += 2;
          await updateRateGalleryApi(
            gallery.gallery_id,
            true,
            userStore.authKey
          );
        }
      }
      isRating.value = false;
    }
  }
  async function voteUpGallery(gallery: Gallery) {
    console.log("downvote gallery");
    if (!isRating.value) {
      isRating.value = true;
      if (gallery !== undefined) {
        if (gallery.user_rating === -1) {
          gallery.user_rating = 0;
          gallery.rating += 1;
          await deleteRatingGalleryApi(gallery.gallery_id, userStore.authKey);
        } else if (gallery.user_rating === 0) {
          gallery.user_rating = -1;
          gallery.rating -= 1;
          await rateGalleryApi(gallery.gallery_id, false, userStore.authKey);
        } else {
          gallery.user_rating = -1;
          gallery.rating -= 2;
          await updateRateGalleryApi(
            gallery.gallery_id,
            false,
            userStore.authKey
          );
        }
      }
      isRating.value = false;
    }
  }
  //to change
  function unCheckGallery(publication_id: string, gallery_id: string) {
    const galleryList = shownGalleriesPicking.value.get(publication_id);
    if (galleryList !== undefined) {
      const index = galleryList.findIndex(
        (gallery) => gallery.gallery_id === gallery_id
      );
      if (index !== -1) {
        galleryList[index].checked = false;
      }
      shownGalleriesPicking.value.set(publication_id, galleryList);
    }
  }
  function checkGallery(publication_id: string, gallery_id: string) {
    const galleryList = shownGalleriesPicking.value.get(publication_id);
    if (galleryList !== undefined) {
      const index = galleryList.findIndex(
        (gallery) => gallery.gallery_id === gallery_id
      );
      if (index !== -1) {
        galleryList[index].checked = true;
      }
      shownGalleriesPicking.value.set(publication_id, galleryList);
    }
  }
  function getShownPickingGalleries(publication_id: string): SimplifiedGalleryForPublication[] {
    return shownGalleriesPicking.value.get(
      publication_id
    ) as SimplifiedGalleryForPublication[];
  }

  async function loadShownPickingGalleries(publication_id: string) {
    const res = await getUser(userStore.username, userStore.authKey);
    if (res.status !== 200) {
      console.log(
        "erreur dans le fetch de l'utilisateur pour get les galleries"
      );
    } else {
      const user = (await res.json()) as User;
      const userGalleries = user.galleries;
      for (let i = 0; i < userGalleries.length; i++) {
        for (let j = 0; j < userGalleries[i].publications.length; j++) {
          if (
            userGalleries[i].publications[j].publication_id === publication_id
          ) {
            userGalleries[i].checked = true;
          }
        }
      }
      shownGalleriesPicking.value.set(publication_id, userGalleries);
    }
  }
  return {
    createGallery, getUsersGalleries, deleteGallery, updateGallery, addPublicationToGallery, removePublicationFromGallery, voteDownGallery, voteUpGallery,
    loadGalleries, reset, removePublicationFromGalleryWithOnlyPublication, getGalleryFromMap, loadShownPickingGalleries, getShownPickingGalleries, unCheckGallery,
    checkGallery, addPublicationToGalleryMap, setGalleryIndex, getGalleryIndex, addIndexToGalleryIndex,
  };
});

//helper functions
function sortGalleriesArrayByDate(galleriesArray: Gallery[]) {
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

function getDateFromString(dateString: string) {
  if (dateString === "now") {
    return new Date();
  }
  const regex = /^(\d+) (\w+) ago$/;
  const matches = regex.exec(dateString);
  if (matches) {
    const amount = parseInt(matches[1]);
    const unit = matches[2];
    const now = new Date();
    switch (unit) {
      case "minutes":
        return new Date(now.getTime() - amount * 60 * 1000);
      case "hours":
        return new Date(now.getTime() - amount * 60 * 60 * 1000);
      case "days":
        return new Date(now.getTime() - amount * 24 * 60 * 60 * 1000);
      case "weeks":
        return new Date(now.getTime() - amount * 7 * 24 * 60 * 60 * 1000);
      case "months":
        return new Date(
          now.getFullYear(),
          now.getMonth() - amount,
          now.getDate()
        );
      case "years":
        return new Date(
          now.getFullYear() - amount,
          now.getMonth(),
          now.getDate()
        );
      default:
        return null;
    }
  } else {
    return null;
  }
}
