<template>
  <NuxtLoadingIndicator :color="false" class="z-100 bg-primary/80" />
  <LayoutBanner v-if="config.banner.enable" />
  <LayoutHeader />

  <div v-if="page && !isWhiteListPath(route.path)" class="min-h-screen border-b">
    <div
      class="flex-1 items-start px-4 md:grid md:gap-6 md:px-8 lg:gap-10"
      :class="[
        config.main.padded && 'container',
        (page.aside ?? true) && 'md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]',
      ]"
    >
      <aside v-if="page.aside ?? true" class="fixed top-[102px] z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto md:sticky md:top-[60px] md:block">
        <LayoutAsideInformation v-if="route.path.startsWith('/information')" :is-mobile="false" />
        <LayoutAsideInformation v-else-if="route.path.startsWith('/mcps')" :is-mobile="false" />
        <LayoutAside v-else :is-mobile="false" />
      </aside>
      <NuxtPage />
    </div>
  </div>
  <NuxtPage v-else />

  <Toaster />
  <LayoutFooter />
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/toast';

// 白名单路径正则
const whiteList = [
  /^\/information$/, // 仅匹配 /information
  /^\/mcps$/, // 仅匹配 /information
  /^\/posts.*/, // 匹配 /posts 及其子路径
  /^\/sites.*/, // 匹配 /sites 及其子路径
  /^\/$/, // 仅匹配根路径
];

// 检查路径是否在白名单中
function isWhiteListPath(path: string) {
  return whiteList.some(pattern => pattern.test(path));
}

const { page } = useContent();
const config = useConfig();
const route = useRoute();
const { themeClass, radius } = useThemes();

useSeoMeta({
  description: config.value.site.description,
  ogDescription: config.value.site.description,
  twitterCard: 'summary_large_image',
});

useServerHead({
  bodyAttrs: {
    class: themeClass.value,
    style: `--radius: ${radius.value}rem;`,
  },
});
</script>
