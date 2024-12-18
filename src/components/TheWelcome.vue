<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'

defineProps<{
  commodities: Commodity[]
}>()
</script>

<template>
  <WelcomeItem v-for="commodity in commodities" :key="commodity.name">
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>{{ commodity.name }}</template>

    <ul>
      <li v-for="variety in commodity.varieties" :key="variety.plu">{{ variety.plu }} - {{ variety.name }}</li>
    </ul>
  </WelcomeItem>
</template>
