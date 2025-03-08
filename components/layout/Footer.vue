<template>
  <footer class="border-t py-6 text-muted-foreground md:py-10">
    <div class="container">
      <!-- 顶部区域：导航链接分组 -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-4">
        <!-- Logo和简介 -->
        <div class="flex flex-col gap-4">
          <NuxtLink to="/" class="flex items-center justify-start">
            <img v-if="config.header.logo" :src="config.header.logo.light" alt="Logo" class="h-8 w-auto dark:hidden">
            <img v-if="config.header.logo" :src="config.header.logo.dark" alt="Logo" class="hidden h-8 w-auto dark:block">
            <span v-if="config.header.showTitle" class="ml-2 self-center font-mono text-[1.75rem] font-bold text-foreground">{{ config.header.title }}</span>
          </NuxtLink>
          <MDC :value="footer.description || ''" class="text-sm" />
        </div>

        <!-- 导航链接分组 - 靠右侧展示 -->
        <div class="col-span-1 md:col-span-3 md:ml-auto">
          <div class="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div v-for="(group, groupIndex) in footer.linkGroups || []" :key="groupIndex" class="flex flex-col gap-3">
              <h3 class="text-base font-semibold">
                {{ group.title }}
              </h3>
              <ul class="flex flex-col gap-2">
                <li v-for="(link, linkIndex) in group.links" :key="linkIndex">
                  <NuxtLink :to="link?.to" :target="link?.target" class="text-sm transition-colors hover:text-foreground hover:underline">
                    {{ link.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="my-8 border-t" />

      <!-- 底部区域：版权信息和社交媒体链接 -->
      <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
        <!-- 版权信息 -->
        <div class="flex items-center gap-2 text-sm">
          <MDC :value="footer.copyright" />
        </div>

        <!-- 社交媒体链接 -->
        <div class="flex items-center gap-2">
          <NuxtLink
            v-for="(link, i) in footer.links"
            :key="i"
            :to="link?.to"
            :target="link?.target"
            class="transition-colors hover:text-foreground"
          >
            <UiButton variant="ghost" size="icon" class="size-9 p-0">
              <SmartIcon v-if="link?.icon" :name="link.icon" :size="20" />
              <span v-if="link?.title && !link?.icon" class="text-sm">{{ link.title }}</span>
            </UiButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <UiButton
      v-if="config.main.backToTop"
      variant="outline"
      size="icon"
      class="fixed bottom-6 right-6 z-50 rounded-full shadow-md"
      @click="scrollToTop"
    >
      <SmartIcon name="lucide:chevron-up" :size="20" />
    </UiButton>
  </footer>
</template>

<script setup lang="ts">
const config = useConfig().value;
const { footer } = config;

// 滚动到顶部函数
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
</script>
