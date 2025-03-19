<template>
  <div class="container mx-auto px-4 py-8 md:px-8">
    <ContentHero :actions="pageData?.actions || []">
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
              placeholder="搜索AGI产品..."
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
                {{ products.length }}
              </UiBadge>
            </UiButton>
            <UiButton
              v-for="category in categories"
              :key="category.id"
              variant="ghost"
              size="sm"
              class="justify-start px-3"
              :class="{ '!bg-primary/10 !font-medium !text-primary': activeCategory === category.id }"
              @click="setActiveCategory(category.id)"
            >
              <Icon :name="getCategoryIcon(category.id)" class="mr-2 size-4" />
              {{ category.name }}
              <UiBadge v-if="activeCategory === category.id || activeCategory === 'all'" variant="outline" class="ml-auto">
                {{ getCategoryCount(category.id) }}
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
            共收录 <span class="font-medium text-foreground">{{ filteredProducts.length }}</span> 个产品
            <span v-if="activeCategory !== 'all'">
              在 <span class="font-medium text-foreground">{{ getCategoryName(activeCategory) }}</span> 分类下
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

        <!-- 产品卡片网格 -->
        <div
          class="grid gap-4" :class="[
            isCompactGrid
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
          ]"
        >
          <UiCard
            v-for="product in filteredProducts"
            :key="product.id"
            class="group h-full overflow-hidden transition-all hover:shadow-md"
            :class="{ compact: isCompactGrid }"
          >
            <NuxtLink :to="product.toolify_ai_url" target="_blank" class="block h-full">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div
                  class="relative bg-muted/30" :class="[
                    isCompactGrid ? 'h-20' : 'h-28',
                  ]"
                >
                  <!-- 如果有产品图片，优先显示产品图片 -->
                  <img
                    v-if="product.screenshot_urls[0]"
                    :src="product.screenshot_urls[0]"
                    :alt="product.title"
                    class="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-110"
                    @error="handleImageError"
                  >
                  <!-- 图片加载失败时显示标题 -->
                  <div
                    v-if="product.screenshot_urls[0]"
                    class="image-fallback absolute inset-0 hidden flex-col items-center justify-center bg-card/50 p-2 text-center"
                  >
                    <span class="font-bold text-muted-foreground" :class="[isCompactGrid ? 'text-lg' : 'text-xl']">{{ product.title }}</span>
                  </div>

                  <!-- 没有图片时显示背景色 -->
                  <div v-if="!product.screenshot_urls[0]" class="absolute inset-0 bg-muted/10" />

                  <!-- Logo 放在右下角 -->
                  <div class="z-99 absolute right-4" :class="[isCompactGrid ? '-bottom-4' : '-bottom-5']">
                    <div
                      class="logo-container flex items-center justify-center overflow-hidden rounded-full border border-border bg-card shadow-sm"
                      :class="[isCompactGrid ? 'size-10' : 'size-12']"
                    >
                      <img
                        :src="product.logo_url || defaultLogoUrl"
                        :alt="product.name"
                        class="logo size-full object-contain p-1.5"
                        @error="handleLogoError"
                      >
                      <div
                        class="logo-fallback hidden size-full items-center justify-center bg-primary/5 font-bold text-primary"
                        :class="[isCompactGrid ? 'text-lg' : 'text-xl']"
                      >
                        {{ product.name.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <span class="text-xs">访问网站</span>
                  <Icon name="lucide:arrow-up-right" class="ml-1 inline-block size-3" />
                </div>
              </div>
              <UiCardHeader :class="{ 'p-3': isCompactGrid, 'p-4': !isCompactGrid }">
                <UiCardTitle class="line-clamp-1" :class="{ 'text-base': isCompactGrid }">
                  {{ product.name }}
                </UiCardTitle>
                <UiCardDescription
                  :class="[
                    isCompactGrid ? 'line-clamp-1 text-xs' : 'line-clamp-2 text-sm',
                  ]"
                >
                  {{ product.short_description }}
                </UiCardDescription>
              </UiCardHeader>
              <UiCardFooter
                class="flex items-center justify-between" :class="[
                  isCompactGrid ? 'px-3 py-2' : 'p-4 pt-0',
                ]"
              >
                <span
                  class="text-muted-foreground" :class="[
                    isCompactGrid ? 'text-xs' : 'text-sm',
                  ]"
                >{{ product.provider }}</span>
                <UiBadge variant="outline" :class="isCompactGrid ? 'text-[10px]' : 'text-xs'">
                  {{ getCategoryName(product.category) }}
                </UiBadge>
              </UiCardFooter>
            </NuxtLink>
          </UiCard>
        </div>

        <!-- 无结果提示 -->
        <div v-if="filteredProducts.length === 0" class="mt-10 text-center">
          <Icon name="lucide:search-x" class="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 class="mb-2 text-xl font-semibold">
            未找到匹配的产品
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
import categories from './categories.json';
import products from './products.json';

interface PageData {
  title: string;
  description: string;
  actions: {
    leftIcon?: string;
    name: string;
    to: string;
    target?: string;
    variant?: string;
  }[];
}

const config = useConfig();
const pageData = ref<PageData>({
  title: '产品导航',
  description: '探索海内外不同类别 AGI 相关产品和工具，助力您的 AI 之旅！',
  actions: [],
});

// 默认图片
const defaultLogoUrl = 'https://placehold.co/200x200/f5f5f5/a3a3a3?text=Logo';
// 未使用的变量添加下划线前缀
const _defaultImageUrl = 'https://placehold.co/800x400/f5f5f5/a3a3a3?text=Image';

// 分类数据
// const categories = [
//   { id: 'llm', name: '大语言模型' },
//   { id: 'coding', name: 'AI编程工具' },
//   { id: 'image', name: 'AI图像生成' },
//   { id: 'audio-video', name: 'AI音频和视频' },
//   { id: 'research', name: 'AI研究和开发' },
//   { id: 'assistant', name: 'AI助手和工具' },
// ];

// 状态管理
const activeCategory = ref('all');
const searchQuery = ref('');
const isCompactGrid = ref(true);

// 根据分类ID获取分类名称
function getCategoryName(categoryId: string): string {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : '';
}

// 获取分类图标
function getCategoryIcon(categoryId: string): string {
  const iconMap: Record<string, string> = {
    'llm': 'lucide:message-square',
    'coding': 'lucide:code',
    'image': 'lucide:image',
    'audio-video': 'lucide:video',
    'research': 'lucide:flask-conical',
  };
  return iconMap[categoryId] || 'lucide:folder';
}

// 获取分类产品数量
function getCategoryCount(categoryId: string): number {
  return products.filter(product => product.category === categoryId).length;
}

// 设置当前活动分类
function setActiveCategory(categoryId: string): void {
  activeCategory.value = categoryId;
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
const filteredProducts = computed(() => {
  let result = products;

  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(product => product.category === activeCategory.value);
  }

  // 按搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(product =>
      product.title.toLowerCase().includes(query)
      || product.description.toLowerCase().includes(query)
      || product.provider.toLowerCase().includes(query),
    );
  }

  return result;
});

// 处理图片加载错误
function handleLogoError(event: Event): void {
  const target = event.target as HTMLImageElement;
  if (target) {
    // 隐藏图片
    target.style.display = 'none';

    // 显示首字母
    const parent = target.parentElement;
    if (parent) {
      const fallback = parent.querySelector('.logo-fallback') as HTMLElement;
      if (fallback) {
        fallback.style.display = 'flex';
        // 确保首字母显示正确
        if (!fallback.textContent || fallback.textContent.trim() === '') {
          // 从 alt 属性获取产品标题
          const title = target.alt || '';
          fallback.textContent = title.charAt(0).toUpperCase();
        }
      }
    }
  }
}

// 处理产品图片加载错误
function handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  if (target) {
    // 隐藏图片
    target.style.display = 'none';

    // 显示标题
    const parent = target.parentElement;
    if (parent) {
      const fallback = parent.querySelector('.image-fallback') as HTMLElement;
      if (fallback) {
        fallback.style.display = 'flex';
      }
    }
  }
}

// 设置页面元数据
useSeoMeta({
  title: `${pageData.value.title ?? '404'} - ${config.value.site.name}`,
  ogTitle: pageData.value.title,
  description: pageData.value.description,
  ogDescription: pageData.value.description,
  twitterCard: 'summary_large_image',
});

defineOgImageComponent(config.value.site.ogImageComponent, {
  title: pageData.value?.title,
  description: pageData.value?.description,
});
</script>

<style scoped>
.compact .v-card-title {
  font-size: 0.9rem;
}

/* 卡片悬停效果 */
.group:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Logo 容器样式 */
.logo-container {
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-width: 2px;
}

.dark .logo-container {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.group:hover .logo-container {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dark .group:hover .logo-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Logo 图片样式 */
.logo {
  transition: all 0.3s ease;
  object-fit: contain;
}

/* Logo 首字母样式 */
.logo-fallback {
  display: none;
}

/* 图片加载错误时显示标题 */
.image-fallback {
  display: none;
  background-color: rgba(var(--card), 0.5);
  backdrop-filter: blur(2px);
}

.dark .image-fallback {
  background-color: rgba(var(--card), 0.7);
}

.image-fallback span {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.02em;
}

.dark .image-fallback span {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 图片加载错误时的样式 */
img.error {
  opacity: 0.5;
  filter: grayscale(100%);
}

/* 卡片内容区域样式 */
.ui-card-header {
  transition: padding 0.3s ease;
}
</style>
