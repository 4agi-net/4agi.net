<template>
  <div class="container mx-auto px-4 py-8 md:px-8">
    <ContentHero :actions="pageData.actions">
      <template #title>
        {{ pageData.title }}
      </template>
      <template #description>
        {{ pageData.description }}
      </template>
    </ContentHero>

    <div class="flex flex-col gap-6 lg:flex-row">
      <!-- 左侧导航 -->
      <div class="lg:sticky lg:top-[80px] lg:w-64 lg:self-start">
        <!-- 搜索框 -->
        <div class="mb-6">
          <h3 class="mb-3 font-medium">
            搜索
          </h3>
          <div class="flex items-center rounded-md border bg-background px-3 py-2">
            <Icon name="lucide:search" class="mr-2 size-4 text-muted-foreground" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索MCP..."
              class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            >
            <UiButton
              v-if="searchQuery"
              variant="ghost"
              size="sm"
              class="size-6 p-0"
              @click="searchQuery = ''"
            >
              <Icon name="lucide:x" class="size-3" />
            </UiButton>
          </div>
        </div>

        <!-- 分类筛选 -->
        <div>
          <h3 class="mb-3 font-medium">
            分类
          </h3>
          <div class="flex flex-col gap-2">
            <UiButton
              variant="ghost"
              size="sm"
              class="justify-start px-3"
              :class="{ 'bg-primary/10 font-medium text-primary': activeCategory === 'all' }"
              @click="setActiveCategory('all')"
            >
              <Icon name="lucide:layers" class="mr-2 size-4" />
              全部
              <UiBadge v-if="activeCategory === 'all'" variant="outline" class="ml-auto">
                {{ mcps.length }}
              </UiBadge>
            </UiButton>
            <UiButton
              v-for="category in mcpsCategories"
              :key="category.name"
              variant="ghost"
              size="sm"
              class="justify-start px-3"
              :class="{ '!bg-primary/10 !font-medium !text-primary': activeCategory === category.name }"
              @click="setActiveCategory(category.name)"
            >
              <Icon :name="getCategoryIcon(category.name)" class="mr-2 size-4" />
              {{ category.name }}
              <UiBadge v-if="activeCategory === category.name || activeCategory === 'all'" variant="outline" class="ml-auto">
                {{ getCategoryCount(category.name) }}
              </UiBadge>
            </UiButton>
          </div>
        </div>

        <!-- 重置筛选按钮 -->
        <UiButton
          v-if="activeCategory !== 'all' || searchQuery"
          variant="outline"
          size="sm"
          class="mt-6 w-full"
          @click="resetFilters"
        >
          <Icon name="lucide:refresh-cw" class="mr-2 size-4" />
          重置筛选
        </UiButton>
      </div>

      <!-- 右侧内容区 -->
      <div class="flex-1">
        <!-- 筛选结果统计 -->
        <div class="mb-4 flex items-center justify-between">
          <p class="text-sm text-muted-foreground">
            共收录 <span class="font-medium text-foreground">{{ filteredMcps.length }}</span> 个MCP
            <span v-if="activeCategory !== 'all'">
              在 <span class="font-medium text-foreground">{{ activeCategory }}</span> 分类下
            </span>
            <span v-if="searchQuery">
              匹配 <span class="font-medium text-foreground">"{{ searchQuery }}"</span>
            </span>
          </p>
          <div class="flex items-center gap-2">
            <UiButton variant="ghost" size="sm" class="gap-1" @click="toggleGridSize">
              <Icon :name="isCompactGrid ? 'lucide:grid-2x2' : 'lucide:grid-3x3'" class="size-4" />
              <span class="text-xs">{{ isCompactGrid ? '标准视图' : '紧凑视图' }}</span>
            </UiButton>
          </div>
        </div>

        <!-- MCP卡片网格 -->
        <div
          class="grid gap-4" :class="[
            isCompactGrid
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
          ]"
        >
          <UiCard
            v-for="mcp in filteredMcps"
            :key="mcp.title"
            class="group h-full overflow-hidden transition-all hover:shadow-md"
            :class="{ compact: isCompactGrid }"
          >
            <NuxtLink :to="mcp._path" target="_blank" class="block h-full">
              <UiCardHeader :class="{ 'p-3 pb-2': isCompactGrid, 'p-4 pb-2': !isCompactGrid }">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="flex size-8 items-center justify-center rounded-md border">
                      <Icon
                        :name="getCategoryIcon(mcp.category)"
                        class="size-4"
                      />
                    </div>
                    <UiCardTitle :class="{ 'text-base': isCompactGrid }">
                      {{ mcp.title }}
                    </UiCardTitle>
                  </div>
                  <Icon name="lucide:external-link" class="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <UiCardDescription
                  :class="[
                    isCompactGrid ? 'mt-2 line-clamp-1 text-xs' : 'mt-2 line-clamp-2 text-sm',
                  ]"
                >
                  {{ mcp.description }}
                </UiCardDescription>
              </UiCardHeader>
              <UiCardFooter
                class="flex items-center justify-between" :class="[
                  isCompactGrid ? 'px-3 py-2' : 'px-4 py-2',
                ]"
              >
                <div class="flex w-full items-center justify-between gap-2">
                  <span
                    class="line-clamp-1 flex-1 text-muted-foreground" :class="[
                      isCompactGrid ? 'text-xs' : 'text-sm',
                    ]"
                  >{{ mcp.provider }}</span>
                  <UiBadge
                    variant="outline"
                    class="flex-shrink-0"
                    :class="[
                      isCompactGrid ? 'px-1.5 py-0 text-[10px]' : 'py-0 text-xs',
                    ]"
                  >
                    {{ mcp.category }}
                  </UiBadge>
                </div>
              </UiCardFooter>
            </NuxtLink>
          </UiCard>
        </div>

        <!-- 无结果提示 -->
        <div v-if="filteredMcps.length === 0" class="mt-10 text-center">
          <Icon name="lucide:search-x" class="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 class="mb-2 text-xl font-semibold">
            未找到匹配的MCP
          </h3>
          <p class="text-muted-foreground">
            尝试使用不同的搜索词或选择其他分类
          </p>
          <UiButton class="mt-4" variant="outline" @click="resetFilters">
            重置筛选
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContentHero from '@/components/content/Hero.vue';
import { mcpsCategories } from '@/lib/config';

interface PageData {
  title: string;
  description: string;
  actions: {
    name: string;
    leftIcon?: string;
    rightIcon?: string;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    to: string;
    target?: string;
  }[];
}

const config = useConfig();

const pageData = ref<PageData>({
  title: 'MCPs',
  description: '发现和探索优质的 MCP 服务器！',
  actions: [{
    name: '了解更多',
    leftIcon: 'lucide:info',
    to: '/mcps',
    variant: 'outline',
  }],
});

const { data } = useAsyncData('content', async () => {
  return queryContent('/').find();
});

const mcps = computed(() => {
  if (!data.value)
    return [];

  let mcpsData = [];

  data.value.forEach((v) => {
    if (v._path?.startsWith('/mcps') && v._type == 'markdown') {
      mcpsData.push(v);
    }
  });

  return mcpsData;
});
console.log(mcps.value);

// 状态管理
const activeCategory = ref('all');
const searchQuery = ref('');
const isCompactGrid = ref(true);

// 获取分类图标
function getCategoryIcon(category: string): string {
  return mcpsCategories.find(v => v.name === category)?.icon || 'tabler:server';
}

// 获取分类颜色
function getCategoryColor(category: string): string {
  return mcpsCategories.find(v => v.name === category)?.color || '#94a3b8';
}

// 获取分类产品数量
function getCategoryCount(category: string): number {
  return mcps.value.filter(mcp => mcp.category === category).length;
}

// 设置当前活动分类
function setActiveCategory(category: string): void {
  activeCategory.value = category;
}

// 切换网格大小
function toggleGridSize(): void {
  isCompactGrid.value = !isCompactGrid.value;
}

// 重置所有筛选条件
function resetFilters(): void {
  activeCategory.value = 'all';
  searchQuery.value = '';
}

// 过滤产品列表
const filteredMcps = computed(() => {
  let result = mcps.value;

  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(mcp => mcp.category === activeCategory.value);
  }

  // 按搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(mcp =>
      mcp.title.toLowerCase().includes(query)
      || mcp.description.toLowerCase().includes(query)
      || mcp.provider.toLowerCase().includes(query),
    );
  }

  return result;
});

// 设置页面元数据
useSeoMeta({
  title: `${pageData.value.title ?? '404'} - ${config.value.site.name}`,
  ogTitle: pageData.value.title,
  description: pageData.value.description,
  ogDescription: pageData.value.description,
  ogImage: config.value.site.ogImage,
  twitterCard: 'summary_large_image',
});
</script>

<style scoped>
.compact .v-card-title {
  font-size: 0.9rem;
}

/* 卡片悬停效果 */
.group {
  transition: all 0.3s ease;
}

.group:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 卡片内容区域样式 */
.ui-card-header {
  transition: padding 0.3s ease;
}

/* 标签样式 */
.ui-badge {
  transition: all 0.2s ease;
}

.ui-badge:hover {
  transform: translateY(-1px);
}

/* 分类图标样式 */
.group:hover .ui-card-title {
  color: var(--primary);
}
</style>
