<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import LoadingScreen from './components/LoadingScreen.vue';
import SearchResults from './components/SearchResults.vue'
import VarietyModal from './components/VarietyModal.vue'
import axios from 'axios'
import Fuse from 'fuse.js';
import { toast } from 'vue3-toastify';
import { onMounted, ref, type Ref } from 'vue';

const TOAST_OPTIONS = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 2000
}

const commodities: Ref<Commodity[]> = ref([]);
const commodityDict: Ref<{ [id: string] : Variety[] }> = ref({});
const searchQuery = ref('');
const searchResults: Ref<Fuse.FuseResult<Variety>[] | undefined> = ref();

const data: Ref<Variety[]> = ref([]);
const isLoading = ref(false);
const isEditing = ref(false);
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
  isLoading.value = true;
  commodityDict.value = {};

  try {
    const response = await axios.get("http://64.23.146.35:5050/commodities");
    data.value = response.data;
  } finally {
    nameFuse.setCollection(data.value);
    pluFuse.setCollection(data.value);

    commodities.value = [];

    for (const entry of data.value) {
      if (!commodityDict.value[entry.commodity]) commodityDict.value[entry.commodity] = [];

      commodityDict.value[entry.commodity].push({
        _id: entry._id,
        plu: `${entry.plu}`,
        variety: entry.variety,
        size: entry.size,
        aka: entry.aka,
        commodity: entry.commodity
      });
    }

    for (const commodityKey in commodityDict.value) {
      commodityDict.value[commodityKey].sort((a, b) => {
        if (a.variety > b.variety) {
          return 1;
        } else if (b.variety > a.variety) {
          return -1;
        }

        return 0;
      });

      commodities.value.push({
        name: commodityKey,
        varieties: commodityDict.value[commodityKey]
      });
    }

    isLoading.value = false;
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

function toggleEditing() {
  isEditing.value = !isEditing.value;
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
  isLoading.value = true;
  
  try {
    if (activeVariety.value) {
      const response = await axios.post(`http://64.23.146.35:5050/commodities/${variety._id}/`, variety);
      const commodity = response.data;

      const index = data.value.findIndex((entry) => entry._id === activeVariety.value?._id);
      data.value[index] = commodity;

      toast("Variety updated successfully!", TOAST_OPTIONS);
    } else {
      const response = await axios.post(`http://64.23.146.35:5050/commodities/`, variety);
      const commodity = response.data;

      data.value.push(commodity);

      toast("Variety created successfully!", TOAST_OPTIONS);
    }
  } catch(error) {
    console.log(error);
    if (activeVariety.value) toast.error("Error updating Variety!", TOAST_OPTIONS);
    else toast.error("Error creating Variety!", TOAST_OPTIONS);
  } finally {
    nameFuse.setCollection(data.value);
    pluFuse.setCollection(data.value);

    isLoading.value = false;
  }
  
  fetchData();
  resetVariety();
  handleInput();
}

async function deleteVariety(variety: Variety) {
  isLoading.value = true;
  
  try {
    await axios.delete(`http://64.23.146.35:5050/commodities/${variety._id}/`);

    const index = data.value.findIndex((entry) => entry._id === activeVariety.value?._id);
    data.value.splice(index, 1);

    toast("Variety deleted successfully!", TOAST_OPTIONS);
  } catch(error) {
    console.log(error);
    toast.error("Error deleting Variety!", TOAST_OPTIONS);
  } finally {
    nameFuse.setCollection(data.value);
    pluFuse.setCollection(data.value);

    isLoading.value = false;
  }

  fetchData();
  resetVariety();
  handleInput();
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
        <img :class="{ editButton: true, active: isEditing }" src="./assets/edit.svg" @click="toggleEditing" alt="Toggle Editing" height="32"/>
      </div>
    </div>
  </header>

  <main>
    <SearchResults
      :commodities="commodities"
      :searchResults="searchResults"
      :onSelectVariety="selectVariety"
      :isEditing="isEditing"
    />
  </main>

  <VarietyModal
    v-if="!isLoading && (activeVariety || isCreating)"
    :variety="activeVariety"
    :onClose="resetVariety"
    :onSubmit="saveVariety"
    :onDelete="deleteVariety"
  />
  <LoadingScreen v-if="isLoading"/>
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
  column-gap: 2rem;
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

.newButton, .editButton {
  cursor: pointer;
  margin: 0 0 0 0.5rem;
  border-radius: 0.3rem;

  &.active {
    background-color: #ddd;
  }
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
