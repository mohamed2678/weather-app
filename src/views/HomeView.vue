<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="serach for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-b-sky-300 focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />
      <ul
        class="absolute bg-sky-800 text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="mapBoxResults"
      >
        <p v-if="searchError">Sorry, something is wrong, Pleace try again.</p>
        <p v-if="!serverErorr && mapBoxResults.length === 0">
          No results found.
        </p>
        <template v-else>
          <li
            v-for="searchResult in mapBoxResults"
            :key="searchResult.id"
            class="py-2 px-1 hover:bg-sky-400 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
         <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import CityList from "@/components/CityList.vue";
import CityCardSkeleton from "@/components/CityCardSkeleton.vue";
//this is a function to preview the city
// this function will be called when the user clicks on a city from the search results
const router = useRouter();
const previewCity = (searchResult) => {
  console.log(searchResult);
  const [city, state] = searchResult.place_name.split(",");
  router.push({
    name: "cityview",
    params: {
      city: city,
      state: state.replaceAll(" ",""),
    },
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true,
    }
  });
};

// token from mapbox
const mapboxAPIKey =
  "pk.eyJ1IjoibW9oYW1lZDI3MjkiLCJhIjoiY205amFhNXdnMGI2ZTJscGozMnF6Z3N3MCJ9.ef7qRYzgF8Anal3e3g_Mmw";
const searchQuery = ref("");
const queryTimeout = ref(null);
const mapBoxResults = ref(null);
const searchError = ref(null);
// function to get the search results
// this function will be called when the user types in the input field
// it will wait for 300ms before sending the request to the server
// this is to avoid sending too many requests to the server
// if the user types too fast
const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/
        ${encodeURIComponent(
          searchQuery.value
        )}.json?access_token=${mapboxAPIKey}&types=place`
        );
        mapBoxResults.value = result.data.features;
      } catch {
        searchError.value = true;
      }
      return;
    }
    mapBoxResults.value = null;
  }, 300);
};
</script>
