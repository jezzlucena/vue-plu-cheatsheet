<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import Fuse from 'fuse.js';

defineProps<{
  commodities: Commodity[],
  searchResults?: Fuse.FuseResult<Variety>[]
}>()
</script>

<template>
  <div v-if="!searchResults || searchResults.length === 0">
    <WelcomeItem v-for="commodity in commodities" :key="commodity.name">
      <template #heading>{{ commodity.name.toLowerCase() }}</template>

      <ul>
        <li v-for="entry in commodity.varieties" :key="entry.plu">{{ entry.plu }} - {{ entry.variety }}</li>
      </ul>
    </WelcomeItem>
  </div>

  <ul v-if="!!searchResults && searchResults.length > 0">
    <li v-for="entry in searchResults" :key="entry.item.plu" class="searchResult">
      <div>{{ entry.item.plu }} - {{ entry.item.commodity }} {{ entry.item.variety }} | Match: {{ Math.ceil((1 - (entry.score || 0)) * 100) }}%</div>
      <div v-if="!!entry.item.aka">Aka.: {{ entry.item.aka }}</div>
    </li>
  </ul>

  <p v-if="!!searchResults && searchResults.length === 0">Sorry, no results were returned for this query.</p>
</template>

<style scoped>
li {
  margin-bottom: 0.5rem;
}

li.searchResult:first-of-type {
  font-weight: bold;
  font-size: 1.2em;

  &::after {
    content: 'Best Match!'
  }
}
</style>