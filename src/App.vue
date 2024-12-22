<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import json from './commodities.json'
import Fuse from 'fuse.js';
import { ref, type Ref } from 'vue';

const commodities: Commodity[] = [];
const commodityDict: { [id: string] : Variety[] } = {};
const searchQuery = ref('');
const searchResults: Ref<Fuse.FuseResult<Variety>[]> = ref([]);

const nameFuse = new Fuse(json, {
  threshold: 0.25,
  keys: [{
    name: 'commodity',
    weight: 3
  }, {
    name: 'variety',
    weight: 1
  }, {
    name: 'aka',
    weight: 1
  }],
  includeScore: true
});

const pluFuse = new Fuse(json, {
  threshold: 0.25,
  keys: ['plu'],
  includeScore: true
});

function handleInput() {
  if (searchQuery.value?.length > 3) {
    if (!isNaN(parseFloat(searchQuery.value)) && isFinite(Number(searchQuery.value))) {
      searchResults.value = pluFuse.search(searchQuery.value);
    } else {
      searchResults.value = nameFuse.search(searchQuery.value);
    }
  } else {
    searchResults.value = [];
  }
}

for (const entry of json) {
  if (!commodityDict[entry.commodity]) commodityDict[entry.commodity] = [];

  commodityDict[entry.commodity].push({
    plu: `${entry.plu}`,
    variety: entry.variety,
    size: entry.size,
    aka: entry.aka,
    commodity: entry.commodity
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
      <HelloWorld />

      <input type="text" v-model="searchQuery" @input="handleInput" placeholder="Search by name or PLU...">
    </div>
  </header>

  <main>
    <TheWelcome :commodities="commodities" :searchResults="searchResults"/>
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

main {
  margin: 1rem 0;
}

input {
  width: 100%;
  line-height: 1.5;
  margin: 1rem 0;
}

@media (min-width: 800px) {
  main {
    columns: 2;
  }
}

@media (min-width: 1024px) {
  main {
    columns: 3;
  }
}
</style>
