<template>
  <header class="sticky top-0 z-50 bg-primary shadow-lg">
    <nav
      class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6"
    >
      <RouterLink :to="{ name: 'home' }">
        <div class="flex items-center gap-3 flex-1">
          <i class="fa-solid fa-sun text-2xl"></i>
          <p class="text-2xl">The Local Weather by galal</p>
        </div>
      </RouterLink>
      <div class="flex gap-3 flex-1 justify-end">
        <i
          class="fa-solid fa-circle-info text-xl hover:text-sky-300 transition duration-150 cursor-pointer"
          @click="toggleModal"
        ></i>
        <i
          class="fa-solid fa-plus duration-150 cursor-pointer hover:text-sky-300 text-xl"
          @click="addCity"
          v-if="route.query.preview"
        ></i>
      </div>
      <BaseModel :modalActive="modalActive" @close-modal="toggleModal">
        <div class="text-black space-y-3 p-4">
          <h1 class="text-2xl font-bold">Welcome to the Weather App!</h1>
          <p>
            This application allows you to check real-time weather information
            for any city around the world. Simply type the city name into the
            input field and click the "Search" button.
          </p>
          <p>
            The app will display the current temperature, weather condition,
            humidity, and wind speed. You can use this app on both desktop and
            mobile devices — it's fully responsive.
          </p>
          <p>
            Built using Vue 3, Pinia, Tailwind CSS, and OpenWeatherMap API.
            Enjoy exploring the weather in your favorite locations!
          </p>
        </div>
      </BaseModel>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { uid } from "uid";
import { RouterLink, useRoute, useRouter } from "vue-router";
import BaseModel from "./BaseModal.vue";

const savedCities = ref([]);
const route = useRoute();
const router = useRouter();
const addCity = () => {
  if (localStorage.getItem("savedCities")) {
    savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
  }
  const locationObj = {
    id: uid(),
    state: route.params.state,
    city: route.params.city,
    coords: {
      lat: route.query.lat,
      lng: route.query.lng,
    },
  };
  savedCities.value.push(locationObj);
  localStorage.setItem("savedCities", JSON.stringify(savedCities.value));
  let query = Object.assign({}, route.query);
  delete query.preview;
  query.id = locationObj.id;
  router.replace({ query });
};

const modalActive = ref(null);
const toggleModal = () => {
  modalActive.value = !modalActive.value;
};
</script>
