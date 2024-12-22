<script setup lang="ts">
import Fuse from 'fuse.js';

defineProps<{
  commodities: Commodity[],
  searchResults?: Fuse.FuseResult<Variety>[]
}>()
</script>

<template>
  <div v-if="!searchResults">
    <div class="item" v-for="commodity in commodities" :key="commodity.name">
      <div class="details">
        <h3>{{ commodity.name.toLowerCase() }}</h3>

        <ul>
          <li v-for="entry in commodity.varieties" :key="entry.plu">{{ entry.plu }} - {{ entry.variety }}</li>
        </ul>
      </div>
    </div>
  </div>

  <ul v-if="(searchResults?.length || 0) > 0">
    <li v-for="entry in searchResults" :key="entry.item.plu" class="searchResult">
      <div>{{ entry.item.plu }} - {{ entry.item.commodity }} {{ entry.item.variety }}</div>
      <div>
        <span v-if="!!entry.item.aka" class="aka">Aka {{ entry.item.aka }} | </span>
        <span class="match">{{ Math.ceil((1 - (entry.score || 0)) * 100) }}%</span>
      </div>
    </li>
  </ul>

  <div v-if="!!searchResults && searchResults.length === 0">Sorry, no results were returned for this query.</div>
</template>

<style scoped>
.item {
  margin-bottom: 2rem;
  display: flex;
  position: relative;
  break-inside: avoid;
}

.details {
  flex: 1;
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
  text-transform: capitalize;
}

li {
  margin-bottom: 0.5rem;
}

li.searchResult {
  break-inside: avoid;

  .aka, .match {
    font-size: 0.8em !important;
  }

  .match::after {
    content: ' Match';
    margin-left: 0.2rem;
    display: inline-block;
  }
}
</style>