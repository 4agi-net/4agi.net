<template>
  <UiBreadcrumb>
    <UiBreadcrumbList>
      <template v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.title">
        <UiBreadcrumbItem>
          <NuxtLink
            :href="breadcrumb.href"
            class="transition-colors hover:text-foreground"
            :class="{ 'font-medium text-primary': index === breadcrumbs.length - 1 }"
          >
            {{ breadcrumb.title }}
          </NuxtLink>
        </UiBreadcrumbItem>
        <UiBreadcrumbSeparator v-if="index !== breadcrumbs.length - 1" />
      </template>
    </UiBreadcrumbList>
  </UiBreadcrumb>
</template>

<script setup lang="ts">
const route = useRoute();

const breadcrumbs = computed(() => useBreadcrumb(route.path));
</script>
