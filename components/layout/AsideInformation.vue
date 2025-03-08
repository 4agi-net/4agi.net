<template>
  <UiScrollArea orientation="vertical" class="relative h-full overflow-hidden py-6 pr-6 text-sm md:pr-4" type="hover">
    <LayoutHeaderNavMobile v-if="isMobile" class="mb-5 border-b pb-2" />
    <LayoutSearchButton v-if="config.search.inAside" />
    <LayoutAsideTree
      :links="tree"
      :level="0"
      :class="[config.aside.useLevel ? 'pt-4' : 'pt-1']"
    />
  </UiScrollArea>
</template>

<script setup lang="ts">
defineProps<{ isMobile: boolean }>();

const { navDirFromPath } = useContentHelpers();
const { navigation: navigationSource } = useContent();
const config = useConfig();

const navigation = computed(() => {
  let information = [];
  navigationSource.value.forEach((v) => {
    if (v._path === '/information') {
      information.push(...v.children);
    }
  });
  return information.sort((a, b) => b.title - a.title);
});

// 递归排序函数
function sortNavigationByTitle(navigation: any[]): any[] {
  if (!navigation || !Array.isArray(navigation))
    return navigation;

  return [...navigation].sort((a, b) => {
    if (!a.title || !b.title)
      return 0;
    return b.title.localeCompare(a.title, 'zh-CN');
  }).map(item => ({
    ...item,
    children: item.children ? sortNavigationByTitle(item.children) : undefined,
  }));
}

const tree = computed(() => {
  const route = useRoute();
  const path = route.path.split('/');
  if (config.value.aside.useLevel) {
    const leveledPath = path.splice(0, 2).join('/');

    const dir = navDirFromPath(leveledPath, navigationSource.value);

    return sortNavigationByTitle(dir ?? []);
  }

  return navigation.value;
});
</script>
