<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import Fuse from 'fuse.js';

defineProps<{
  commodities: Commodity[],
  searchResults?: Fuse.FuseResult<Variety>[]
}>()
</script>

<template>
  <div v-if="!searchResults || searchResults.length === 0">
    <WelcomeItem v-for="commodity in commodities" :key="commodity.name">
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>{{ commodity.name.toLowerCase() }}</template>

      <ul>
        <li v-for="variety in commodity.varieties" :key="variety.plu">{{ variety.plu }} - {{ variety.name }}</li>
      </ul>
    </WelcomeItem>
  </div>

  <ul v-if="!!searchResults && searchResults.length > 0">
    <li v-for="variety in searchResults" :key="variety.item.plu">
      <div>{{ variety.item.plu }} - {{ variety.item.commodity }} {{ variety.item.variety }} | Match: {{ Math.ceil((1 - (variety.score || 0)) * 100) }}%</div>
      <div v-if="!!variety.item.aka">Aka.: {{ variety.item.aka }}</div>
    </li>
  </ul>

  <p v-if="!!searchResults && searchResults.length === 0">Sorry, no results were returned for this query.</p>
</template>

<style scoped>
li {
  margin-bottom: 0.5rem;
}
</style>