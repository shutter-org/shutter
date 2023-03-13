<template>

  <div class="home p-10 max-w-5xl ml-auto mr-auto flex flex-col gap-8">
    <Publication
      username="Blond141"
      profile_picture="https://h5p.org/sites/default/files/h5p/content/1209180/images/file-6113d5f8845dc.jpeg"
      image="https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=pexels-pixabay-206359.jpg&fm=jpg"
      desc="Belle photo au Canadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!"
      :total_rate="12"
      :user_rate="0"
    ></Publication>
    <Publication
      username="Chinman69"
      profile_picture="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Chinese_flag_%28Beijing%29_-_IMG_1104.jpg/220px-Chinese_flag_%28Beijing%29_-_IMG_1104.jpg"
      image="https://pm1.narvii.com/6522/78ef51ad4b97e65dba9a865fdd0a7760595b3790_hq.jpg"
      desc="fuck league"
      :total_rate="420"
      :user_rate="1"
    ></Publication>
    <Publication
      username="Alex_Prudent"
      profile_picture="https://i5.walmartimages.ca/images/Enlarge/061/024/999999-773554061024.jpg"
      image="https://cdn.redmondpie.com/wp-content/uploads/2019/05/macbook-pro-fire-1200px.jpg"
      desc="brule mon mac parce que c'est trash"
      :total_rate="-1"
      :user_rate="-1"
    ></Publication>
  </div>
</template>

<script>
import Publication from "@/components/Publication.vue";

export default {
  components: {
    Publication,
  },
};
</script>

<style>
.home {
  background-color: var(--color-background-soft);
}
</style>
