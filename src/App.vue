<template>
  <div>
    <default-menubar />
    <div id="router-view" class="ml-64 PRO:ml-0 PRO:mb-20 PRO:mt-20">
      <RouterView />
    </div>
</div>
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import DefaultMenubar from "@/components/menubar.vue";
</script>
<style scoped></style>
