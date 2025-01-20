<script setup lang="ts">
import Fuse from 'fuse.js';

defineProps<{
  commodities: Commodity[],
  searchResults?: Fuse.FuseResult<Variety>[],
  onSelectVariety: (variety: Variety) => void
}>()
</script>

<template>
  <div v-if="!searchResults">
    <div class="item" v-for="commodity in commodities" :key="commodity.name">
      <h3>{{ commodity.name }}</h3>

      <ul>
        <li v-for="entry in commodity.varieties" :key="entry.plu">
          <div class="info">
            <div class="name">{{ entry.variety }}</div>
            <div class="plu">{{ entry.plu }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <ul v-if="(searchResults?.length || 0) > 0">
    <li v-for="entry in searchResults" :key="entry.item.plu" class="item" @click="onSelectVariety(entry.item)">
      <div class="info">
        <div class="name">{{ entry.item.commodity }} {{ entry.item.variety }}</div>
        <div class="plu">{{ entry.item.plu }}</div>
      </div>
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

.info {
  display: flex;
  position: relative;

  .plu {
    text-align: right;
    flex-grow: 1;
    margin-left: 1rem;
  }
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

ul {
  list-style-type: none;
  padding: 0 2rem 0 0;

  li {
    padding: 0.5rem 0;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    &:last-child {
      margin-bottom: 1rem;
    }
  }
}
</style>