<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 头部区域响应式处理 -->
    <ContentHero :actions="pageData.actions">
      <template #title>
        {{ pageData.title }}
      </template>
      <template #description>
        {{ pageData.description }}
      </template>
    </ContentHero>

    <!-- 时间线区域响应式处理 -->
    <div class="relative">
      <!-- 时间线轴线 -->
      <div
        class="absolute inset-y-4 left-[19px] w-[2px]  sm:left-[19px] lg:left-1/2 lg:-translate-x-1/2"
      >
        <!-- 添加轴线动画效果 -->
        <div class="absolute inset-0 bg-primary/10" />
      </div>

      <!-- 时间线内容 -->
      <div class="space-y-8 sm:space-y-12">
        <div
          v-for="(timeBlock, index) in processedTimelineData"
          :key="index"
          class="relative flex w-full animate-[fadeInUp_0.5s_ease-out_forwards] flex-col pl-[52px] lg:flex-row lg:items-start lg:justify-between lg:pl-0"
          :class="[`animation-delay-${index * 2}00`]"
        >
          <!-- 时间线圆点 -->
          <div
            class="absolute left-[15px] top-3 z-10 lg:left-1/2 lg:-translate-x-1/2"
          >
            <!-- 主圆点 -->
            <div class="relative size-[10px]">
              <div
                class="absolute inset-0 rounded-full bg-primary"
                :class="[
                  index === 0 ? 'shadow-[0_0_10px_rgba(var(--primary))]' : '',
                ]"
              />
              <!-- 扩散动画，只在第一个节点显示 -->
              <template v-if="index === 0">
                <div class="absolute -inset-2 animate-ping rounded-full bg-primary/40" />
                <div class="absolute -inset-4 animate-pulse rounded-full bg-primary/20" />
              </template>
            </div>
          </div>

          <!-- 日期标签 - 小屏幕上显示在顶部 -->
          <div
            class="mb-4 lg:hidden"
            :class="{ 'lg:text-right': index % 2 !== 0 }"
          >
            <div class="inline-flex items-center rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              {{ timeBlock.date }}
              <span class="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {{ timeBlock.totalItems }}条
              </span>
            </div>
          </div>

          <!-- 内容区域 -->
          <template v-if="index % 2 === 0">
            <!-- 左侧内容 -->
            <div class="group w-full lg:w-[calc(50%-2rem)] lg:pr-8">
              <!-- 大屏日期标签 -->
              <div class="mb-4 hidden text-right lg:block">
                <div class="inline-flex items-center rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  {{ timeBlock.date }}
                  <span class="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {{ timeBlock.totalItems }}条
                  </span>
                </div>
              </div>
              <!-- 资讯列表 -->
              <div class="space-y-2">
                <div
                  v-for="(item, itemIndex) in timeBlock.displayItems"
                  :key="itemIndex"
                  class="group relative flex items-start space-x-2 rounded border-l-2 border-transparent bg-transparent px-3 py-2 transition-all hover:border-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent lg:flex-row-reverse lg:space-x-reverse lg:border-l-0 lg:border-r-2 lg:text-right lg:hover:bg-gradient-to-l"
                >
                  <div class="mt-1 size-1.5 rounded-full bg-primary/30 transition-all group-hover:bg-primary" />
                  <div class="flex-1 space-y-1">
                    <NuxtLink :to="item.link" class="block text-sm font-medium transition-colors hover:text-primary">
                      {{ item.title }}
                    </NuxtLink>
                    <p class="line-clamp-1 text-xs text-muted-foreground">
                      {{ item.description }}
                    </p>
                  </div>
                </div>

                <!-- 左侧查看更多按钮 -->
                <NuxtLink
                  v-if="timeBlock.hasMore"
                  :to="timeBlock.link"
                  class="group mt-4 flex items-center space-x-2 rounded-full bg-gradient-to-r from-primary/5 via-primary/10 to-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:from-primary/10 hover:via-primary/20 hover:text-primary lg:flex-row-reverse lg:space-x-reverse lg:bg-gradient-to-l"
                >
                  <span>查看更多</span>
                  <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">+{{ timeBlock.totalItems - ITEMS_PER_DAY }}</span>
                  <Icon
                    name="lucide:chevron-right"
                    class="size-4 transition-transform group-hover:translate-x-1 lg:-rotate-180 lg:group-hover:-translate-x-1"
                  />
                </NuxtLink>
              </div>
            </div>
            <div class="hidden w-[calc(50%-2rem)] lg:block" />
          </template>

          <template v-else>
            <div class="hidden w-[calc(50%-2rem)] lg:block" />
            <!-- 右侧内容 -->
            <div class="group w-full lg:w-[calc(50%-2rem)] lg:pl-8">
              <!-- 大屏日期标签 -->
              <div class="mb-4 hidden lg:block">
                <div class="inline-flex items-center rounded-full bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  {{ timeBlock.date }}
                  <span class="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {{ timeBlock.totalItems }}条
                  </span>
                </div>
              </div>
              <!-- 资讯列表 -->
              <div class="space-y-2">
                <div
                  v-for="(item, itemIndex) in timeBlock.displayItems"
                  :key="itemIndex"
                  class="group relative flex items-start space-x-2 rounded border-l-2 border-transparent bg-transparent px-3 py-2 transition-all hover:border-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent"
                >
                  <div class="mt-1 size-1.5 rounded-full bg-primary/30 transition-all group-hover:bg-primary" />
                  <div class="flex-1 space-y-1">
                    <NuxtLink :to="item.link" class="block text-sm font-medium transition-colors hover:text-primary">
                      {{ item.title }}
                    </NuxtLink>
                    <p class="line-clamp-1 text-xs text-muted-foreground">
                      {{ item.description }}
                    </p>
                  </div>
                </div>

                <!-- 右侧查看更多按钮 -->
                <NuxtLink
                  v-if="timeBlock.hasMore"
                  :to="timeBlock.link"
                  class="group mt-4 flex items-center space-x-2 rounded-full bg-gradient-to-r from-primary/5 via-primary/10 to-transparent px-4 py-2 text-sm text-muted-foreground transition-all hover:from-primary/10 hover:via-primary/20 hover:text-primary"
                >
                  <span>查看更多</span>
                  <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">+{{ timeBlock.totalItems - ITEMS_PER_DAY }}</span>
                  <Icon
                    :name="getChevronName(index, false)"
                    class="size-4 transition-transform group-hover:translate-x-1 lg:group-hover:-translate-x-1"
                  />
                </NuxtLink>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ContentHero from '@/components/content/Hero.vue';

// 在 script setup 中添加计算属性和方法
const ITEMS_PER_DAY = 5;
const config = useConfig();
const pageData = ref({
  title: '每日资讯',
  description: '每日精选人工智能、大语言模型、AIGC 等领域的最新资讯，及时了解行业动态。我们提供多种订阅方式，让您不错过任何重要更新。',
  actions: [
    {
      leftIcon: 'i-simple-icons-rss',
      name: 'RSS 订阅',
      to: '/posts/rss.xml',
      target: '_blank',
      variant: 'outline',
    },
    {
      leftIcon: 'i-simple-icons-x',
      name: 'Twitter',
      to: 'https://x.com/4agi',
      target: '_blank',
      variant: 'outline',
    },
  ],
});

const { data } = useAsyncData('content', async () => {
  return queryContent('/').find();
});

const information = computed(() => {
  if (!data.value)
    return [];

  let informationData = [];

  data.value.forEach((v) => {
    if (v._path?.startsWith('/information') && v._type == 'markdown') {
      informationData.push(v);
    }
  });

  return informationData;
});

// 筛选方法
function filterCardsWithH2(data, parentPath) {
  const result = [];
  let h2Id = null;

  data.forEach((item) => {
    if (item.tag === 'h2') {
      h2Id = item.props?.id;
    } else if (item.tag === 'card' && h2Id) {
      result.push({ ...item.props, hash: h2Id, link: `${parentPath}/#${h2Id}` });
    }
  });

  return result;
}

const infoList = computed(() => {
  return information.value.map((v) => {
    const arr = filterCardsWithH2(v?.body?.children, v._path);
    return {
      date: v.title,
      link: v._path,
      items: arr,
    };
  }).sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

useSeoMeta({
  title: `${pageData.value.title ?? '404'} - ${config.value.site.name}`,
  ogTitle: pageData.value.title,
  description: pageData.value.description,
  ogDescription: pageData.value.description,
  ogImage: config.value.site.ogImage,
  twitterCard: 'summary_large_image',
});

// 计算箭头方向
const getChevronName = computed(() => (index, isLeft) => {
  if (isLeft) {
    return 'lucide:chevron-right';
  }
  return 'lucide:chevron-right';
});

// 处理显示逻辑的计算属性
const processedTimelineData = computed(() => {
  return infoList.value.map((block) => {
    const totalItems = block.items.length;
    const hasMore = totalItems > ITEMS_PER_DAY;

    return {
      ...block,
      displayItems: block.items.slice(0, ITEMS_PER_DAY),
      hasMore,
      totalItems,
    };
  });
});
</script>

<style scoped>
.bg-card {
  background-color: hsl(var(--card));
}

/* 添加动画延迟类 */
.animation-delay-200 {
  animation-delay: 200ms;
}
.animation-delay-400 {
  animation-delay: 400ms;
}
.animation-delay-600 {
  animation-delay: 600ms;
}

/* 添加发光动画 */
@keyframes glow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.8; }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

/* 添加淡入上升动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
