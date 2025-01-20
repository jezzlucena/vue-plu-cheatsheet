<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import SearchResults from './components/SearchResults.vue'
import VarietyModal from './components/VarietyModal.vue'
import axios from 'axios'
import Fuse from 'fuse.js';
import { onMounted, ref, toRaw, type Ref } from 'vue';

const commodities: Commodity[] = [];
const commodityDict: { [id: string] : Variety[] } = {};
const searchQuery = ref('');
const searchResults: Ref<Fuse.FuseResult<Variety>[] | undefined> = ref();

const data: Ref<Variety[]> = ref([]);
const loading = ref(false);
const activeVariety: Ref<Variety | undefined> = ref();
const isCreating = ref(false);

const nameFuse = new Fuse(data.value, {
  threshold: 0.3,
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

const pluFuse = new Fuse(data.value, {
  threshold: 0.25,
  keys: ['plu'],
  includeScore: true
});

const fetchData = async () => {
  loading.value = true;

  try {
    const response = await axios.get("http://localhost:5050/commodities");
    data.value = response.data;
  } finally {
    nameFuse.setCollection(data.value);
    pluFuse.setCollection(data.value);

    loading.value = false;
  }
};

onMounted(fetchData);

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

function handleNew() {
  activeVariety.value = undefined;
  isCreating.value = true;
}

for (const entry of data.value) {
  if (!commodityDict[entry.commodity]) commodityDict[entry.commodity] = [];

  commodityDict[entry.commodity].push({
    id: entry.id,
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

function resetVariety() {
  activeVariety.value = undefined;
  isCreating.value = false;
}

function selectVariety(variety: Variety) {
  activeVariety.value = variety;
  isCreating.value = false;
}

async function saveVariety(variety: Variety) {
  loading.value = true;
  
  try {
    if (activeVariety.value) {
      const response = await axios.post(`http://localhost:5050/commodities/${variety.id}/`, variety);
      const commodity = response.data;

      const index = data.value.findIndex((entry) => entry.id === activeVariety.value?.id);
      data.value[index] = commodity;
    } else {
      const response = await axios.post(`http://localhost:5050/commodities/`, variety);
      const commodity = response.data;

      data.value.push(commodity);
    }
  } finally {
    nameFuse.setCollection(data.value);
    pluFuse.setCollection(data.value);

    loading.value = false;
  }
  
  resetVariety();
}
</script>

<template>
  <header>
    <img alt="Trader Joe's logo" class="logo" src="./assets/logo.png" height="125" />

    <div class="wrapper">
      <AppHeader />

      <div class="row">
        <input type="text" v-model="searchQuery" @input="handleInput" placeholder="Search by name or PLU...">
        <img class="newButton" src="./assets/plus.svg" @click="handleNew" alt="New Product" height="32"/>
      </div>
    </div>
  </header>

  <main>
    <SearchResults :commodities="commodities" :searchResults="searchResults" :onSelectVariety="selectVariety"/>
  </main>

  <VarietyModal v-if="activeVariety || isCreating" :variety="activeVariety" :onClose="resetVariety" :onSubmit="saveVariety"/>
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

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.newButton {
  cursor: pointer;
  margin: 0 0 0 0.5rem;
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
