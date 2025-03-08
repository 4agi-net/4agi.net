<template>
  <div class="mt-16">
    <div class="mb-6 flex w-full items-center justify-between">
      <!-- Left: Edit Link -->
      <LayoutEditLink />
      <!-- Right: Back to Top Button -->
      <LayoutBackToTop />
    </div>
    <LayoutPrevNext v-if="isDocsPath" path="/docs" />
    <div class="flex">
      <LayoutCarbonAds v-if="!isDesktop && carbonAdsEnabled" class="mx-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { carbonAds } = useConfig().value.toc;
const isDesktop = useMediaQuery('(min-width: 1024px)');
const route = useRoute();

const carbonAdsEnabled = computed(
  () => carbonAds.enable && !carbonAds.disableInMobile && !(import.meta.dev && carbonAds.disableInDev),
);

// 检查当前路径是否在 /docs 目录下
const isDocsPath = computed(() => route.path.startsWith('/docs'));
</script>
