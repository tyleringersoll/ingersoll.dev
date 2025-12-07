<template>
  <article class="untappd__checkins">
    <h2>The last few beers I've sipped (according to Untappd)</h2>
    <div v-if="untappdData" class="untappd__checkins-beers">
      <img
        v-for="(beerItem, index) in recentBeer"
        :key="`beer-${beerItem.beer.bid}-${index}`"
        class="untappd__checkins-icon"
        :src="beerItem.beer.beer_label"
        :alt="beerItem.beer.beer_name"
        loading="lazy"
      />
    </div>
  </article>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getApiData } from "@/services/api.service";

const props = defineProps({
  user: {
    type: String,
    default: "drinkingisawesome",
  },
  numberOfBeers: {
    type: Number,
    default: 10,
  },
});

const untappdData = ref(null);

const beerData = computed(() => {
  return untappdData.value?.response?.checkins?.items || null;
});

const recentBeer = computed(() => {
  if (!beerData.value) {
    return [];
  }

  const beerIds = beerData.value.map((item) => item.beer.bid);
  const uniqueBeerIds = [...new Set(beerIds)];
  const recentBeerIds = uniqueBeerIds.slice(0, props.numberOfBeers);

  return recentBeerIds
    .map((beerId) => beerData.value.find((item) => item.beer.bid === beerId))
    .filter(Boolean);
});

// eslint-disable-next-line no-unused-vars
const getUntappdData = async () => {
  const domain = "https://api.untappd.com";
  const api = "v4";
  const method = "user/checkins";
  const clientId = process.env.VUE_APP_UNTAPPD_CLIENT_ID;
  const clientSecret = process.env.VUE_APP_UNTAPPD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn(
      "Untappd API credentials not configured. Check environment variables."
    );
    return;
  }

  const apiUrl = `${domain}/${api}/${method}/${props.user}?client_id=${clientId}&client_secret=${clientSecret}`;

  try {
    const apiData = await getApiData(apiUrl);
    untappdData.value = apiData;
  } catch (error) {
    console.error("Failed to fetch Untappd checkins:", error);
  }
};

onMounted(() => {
  // getUntappdData();
});
</script>

<style lang="scss" scoped>
.untappd {
  &__checkins {
    margin-top: $spacing-xl;
    margin-bottom: $spacing-xl;
  }

  &__checkins-beers {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin: $spacing-sm 0 0;
  }

  &__checkins-icon {
    display: inline-block;
    width: 100%;
    height: auto;
    max-width: 50px;
    margin: $spacing-xs $spacing-xs 0 0;

    @include respond-to(sm) {
      max-width: 100px;
    }
  }
}
</style>
