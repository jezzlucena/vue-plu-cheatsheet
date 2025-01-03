<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import SearchResults from './components/SearchResults.vue'
import json from './commodities.json'
import Fuse from 'fuse.js';
import { ref, type Ref } from 'vue';

const commodities: Commodity[] = [];
const commodityDict: { [id: string] : Variety[] } = {};
const searchQuery = ref('');
const searchResults: Ref<Fuse.FuseResult<Variety>[] | undefined> = ref();

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
    searchResults.value = undefined;
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
  commodityDict[commodityKey].sort((a, b) => {
    if (a.variety > b.variety) {
      return 1;
    } else if (b.variety > a.variety) {
      return -1;
    }

    return 0;
  });

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
      <AppHeader />

      <input type="text" v-model="searchQuery" @input="handleInput" placeholder="Search by name or PLU...">
    </div>
  </header>

  <main>
    <SearchResults :commodities="commodities" :searchResults="searchResults"/>
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
  position: relative;
  width: 100%;
  line-height: 1.5;
  margin: 1rem 0;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/5/55/Magnifying_glass_icon.svg');
  background-repeat: no-repeat;
  background-position: 14px 14px;
  background-size: 18px;
  padding: 12px 20px 12px 40px;
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
