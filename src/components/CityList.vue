<template>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard :city="city" @click="goToCityView(city)" />
  </div>

  <p v-if="savedCities.length === 0">
    No saved cities. Please add a city to your favorites.
  </p>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import CityCard from "@/components/CityCard.vue";
import { useRouter } from "vue-router";

const savedCities = ref([]);
const getCities = async () => {
  if (localStorage.getItem("savedCities")) {
    savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
    const requests = [];
    savedCities.value.forEach((city) => {
      requests.push(
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=0f849ea4d4b5de761c407bd8a82f3c8c&units=metric`
        )
      );
    });
    const weatherData = await Promise.all(requests);
    // Flicker Delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Update the weather data in the savedCities array

    weatherData.forEach((value, index) => {
      savedCities.value[index].weather = value.data;
    });
  }
};

await getCities();
const router = useRouter();
const goToCityView = (city) => {
  router.push({
    name: "cityview",
    params: { state: city.state, city: city.city },
    query: {
      id: city.id,
      lat: city.coords.lat,
      lng: city.coords.lng,
    },
  });
};
</script>
