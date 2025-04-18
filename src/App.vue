<template>
  <div class="bg-primary flex flex-col min-h-screen font-sans bg-primary">
    <SiteNav />
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>
<script setup>
import SiteNav from "./components/SiteNav.vue";
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: 400ms ease all;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>