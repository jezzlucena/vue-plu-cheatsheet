<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import csv from './commodities.csv'
import Fuse from 'fuse.js';
import { computed, ref } from 'vue';

const commodities: Commodity[] = [];
const commodityDict: { [id: string] : Variety[] } = {};
const searchQuery = ref('4238');

const fuse = new Fuse(csv, {
  threshold: 0.25,
  keys: [
    {
      name: 'plu', 
      weight: 3
    },
    {
      name: 'commodity', 
      weight: 1
    },
    {
      name: 'variety', 
      weight: 1
    },
    {
      name: 'aka',
      weight: 1
    },
  ]
});

const searchResults = computed(() => {
  if (searchQuery.value === '') {
    return csv;
  } else {
    return fuse.search(searchQuery.value);
  }
});

console.log(searchResults.value)

for (const variety of searchResults.value) {
  if (!commodityDict[variety.item.commodity]) commodityDict[variety.item.commodity] = [];

  commodityDict[variety.item.commodity].push({
    plu: variety.item.plu,
    name: variety.item.variety ? variety.item.variety : variety.item.commodity,
    size: variety.item.size
  });
}

for (const commodityKey in commodityDict) {
  commodities.push({
    name: commodityKey,
    varieties: commodityDict[commodityKey]
  });
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>

    <input type="text" v-model="searchQuery">
  </header>

  <main>
    <TheWelcome :commodities="commodities"/>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  main {
    height: 100vh;
  }
}
</style>
