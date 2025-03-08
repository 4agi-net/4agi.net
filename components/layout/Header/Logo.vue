<template>
  <div>
    <NuxtLink v-if="logo.light && logo.dark" to="/" class="flex items-center justify-center">
      <NuxtImg :src="logo.light" class="h-6 dark:hidden" />
      <NuxtImg :src="logo.dark" class="hidden h-6 dark:block" />
      <span v-if="showTitle && title" class="ml-2 self-center font-mono text-[1.25rem] font-bold">
        {{ title }}
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { logo, title, showTitle } = useConfig().value.header;
</script>
