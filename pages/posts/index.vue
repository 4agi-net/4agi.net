<template>
  <div
    class="px-4 py-6 md:px-8"
    :class="[config.main.padded && 'container']"
  >
    <ContentHero :actions="pageData.actions">
      <template #title>
        {{ pageData.title }}
      </template>
      <template #description>
        {{ pageData.description }}
      </template>
    </ContentHero>
    <div>
      <div class="group grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&:not(:first-child)]:mt-5">
        <PostCard v-for="article in articles" :key="article._id" :title="article.title" :description="article.description" :img="article.image" target="_self" :to="article._path">
          <template #footer>
            <div class="flex w-full items-center justify-between gap-2">
              <div class="flex flex-col items-start justify-start">
                <UiBadge variant="outline">
                  {{ article?.category || '无分类' }}
                </UiBadge>
                <span class="mt-1 text-sm text-gray-500">{{ article.date }}</span>
              </div>

              <div class="flex items-center gap-2">
                <PostAvatarGroup v-if="article.authors.length > 1">
                  <UiAvatar v-for="(author, index) in article.authors" :key="author.username" :style="{ zIndex: article.authors.length - index }" size="sm">
                    <UiAvatarImage :src="author.avatar?.src" :alt="`@${author.username}`" />
                    <UiAvatarFallback>{{ author.username.slice(0, 2) }}</UiAvatarFallback>
                  </UiAvatar>
                </PostAvatarGroup>
                <UiAvatar v-else-if="article.authors.length === 1" :key="article.authors[0].username">
                  <UiAvatarImage :src="article.authors[0].avatar?.src" :alt="`@${article.authors[0].username}`" />
                  <UiAvatarFallback>{{ article.authors[0].username.slice(0, 2) }}</UiAvatarFallback>
                </UiAvatar>
              </div>
            </div>
          </template>
        </PostCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import ContentHero from '@/components/content/Hero.vue';
import PostAvatarGroup from '@/components/post/AvatarGroup.vue';
import PostCard from '@/components/post/Card.vue';

interface PageData {
  title: string
  description: string
  actions: Array<{
    leftIcon: string
    name: string
    to: string
    target: string
    variant: string
  }>
}

interface Article extends ParsedContent {
  title: string
  description?: string
  image?: string
  category?: string
  date: string
  authors: Array<{
    username: string
    avatar?: {
      src: string
    }
  }>
}

const config = useConfig();
const pageData = ref<PageData>({
  title: '社区',
  description: '阅读 4agi 社区的优质文章！',
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
  return queryContent('/').find()
});

const articles = computed<Article[]>(() => {
  if (!data.value) return []

  let articlesData: Article[] = []

  data.value.forEach(v => {
    if(v._path?.startsWith('/posts') && v._type == 'markdown') {
      articlesData.push(v)
    }
  })
  return articlesData.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

useSeoMeta({
  title: `${pageData.value.title ?? '404'} - ${config.value.site.name}`,
  ogTitle: pageData.value.title,
  description: pageData.value.description,
  ogDescription: pageData.value.description,
  ogImage: config.value.site.ogImage,
  twitterCard: 'summary_large_image',
});
</script>
