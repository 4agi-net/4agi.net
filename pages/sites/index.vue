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
            <NuxtLink :to="product.url" target="_blank" class="block h-full">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div
                  class="relative bg-muted/30" :class="[
                    isCompactGrid ? 'h-20' : 'h-28',
                  ]"
                >
                  <!-- 如果有产品图片，优先显示产品图片 -->
                  <img
                    v-if="product.image"
                    :src="product.image"
                    :alt="product.title"
                    class="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-110"
                    @error="handleImageError"
                  >
                  <!-- 图片加载失败时显示标题 -->
                  <div
                    v-if="product.image"
                    class="image-fallback absolute inset-0 hidden flex-col items-center justify-center bg-card/50 p-2 text-center"
                  >
                    <span class="font-bold text-muted-foreground" :class="[isCompactGrid ? 'text-lg' : 'text-xl']">{{ product.title }}</span>
                  </div>

                  <!-- 没有图片时显示背景色 -->
                  <div v-if="!product.image" class="absolute inset-0 bg-muted/10" />

                  <!-- Logo 放在右下角 -->
                  <div class="z-99 absolute right-4" :class="[isCompactGrid ? '-bottom-4' : '-bottom-5']">
                    <div
                      class="logo-container flex items-center justify-center overflow-hidden rounded-full border border-border bg-card shadow-sm"
                      :class="[isCompactGrid ? 'size-10' : 'size-12']"
                    >
                      <img
                        :src="product.logo || defaultLogoUrl"
                        :alt="product.title"
                        class="logo size-full object-contain p-1.5"
                        @error="handleLogoError"
                      >
                      <div
                        class="logo-fallback hidden size-full items-center justify-center bg-primary/5 font-bold text-primary"
                        :class="[isCompactGrid ? 'text-lg' : 'text-xl']"
                      >
                        {{ product.title.charAt(0).toUpperCase() }}
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
                <UiCardTitle :class="{ 'text-base': isCompactGrid }">
                  {{ product.title }}
                </UiCardTitle>
                <UiCardDescription
                  :class="[
                    isCompactGrid ? 'line-clamp-1 text-xs' : 'line-clamp-2 text-sm',
                  ]"
                >
                  {{ product.description }}
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
const categories = [
  { id: 'llm', name: '大语言模型' },
  { id: 'coding', name: 'AI编程工具' },
  { id: 'image', name: 'AI图像生成' },
  { id: 'audio-video', name: 'AI音频和视频' },
  { id: 'research', name: 'AI研究和开发' },
  { id: 'assistant', name: 'AI助手和工具' },
];

// 产品数据
const products = [
  // 大语言模型
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    description: 'OpenAI开发的对话式大语言模型，支持GPT-3.5和GPT-4',
    provider: 'OpenAI',
    category: 'llm',
    url: 'https://chat.openai.com',
    icon: 'simple-icons:openai',
    iconColor: 'text-emerald-500',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
    image: 'https://images.unsplash.com/photo-1693118142978-f6679bebeadc?q=80&w=1000',
  },
  {
    id: 'claude',
    title: 'Claude',
    description: 'Anthropic开发的对话式AI助手，以安全性和有用性著称',
    provider: 'Anthropic',
    category: 'llm',
    url: 'https://claude.ai',
    icon: 'simple-icons:anthropic',
    iconColor: 'text-purple-500',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Anthropic_Logo.svg/1200px-Anthropic_Logo.svg.png',
    image: '',
  },
  {
    id: 'gemini',
    title: 'Gemini',
    description: 'Google开发的多模态大语言模型，支持文本、图像和音频输入',
    provider: 'Google',
    category: 'llm',
    url: 'https://gemini.google.com',
    icon: 'simple-icons:google',
    iconColor: 'text-blue-500',
    logo: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_1.max-1000x1000.png',
    image: '',
  },
  {
    id: 'llama',
    title: 'Llama',
    description: 'Meta开发的开源大语言模型，可本地部署和自定义训练',
    provider: 'Meta',
    category: 'llm',
    url: 'https://llama.meta.com',
    icon: 'simple-icons:meta',
    iconColor: 'text-blue-400',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png',
    image: '',
  },
  {
    id: 'gpt4all',
    title: 'GPT4All',
    description: '开源的本地运行大语言模型，无需互联网连接即可使用',
    provider: 'Nomic AI',
    category: 'llm',
    url: 'https://gpt4all.io',
    icon: 'lucide:cpu',
    iconColor: 'text-orange-500',
    logo: 'https://gpt4all.io/assets/images/gpt4all-128.png',
    image: '',
  },
  {
    id: 'perplexity',
    title: 'Perplexity AI',
    description: '基于AI的搜索引擎，提供准确、实时的信息和引用来源',
    provider: 'Perplexity',
    category: 'llm',
    url: 'https://www.perplexity.ai',
    icon: 'simple-icons:perplexity',
    iconColor: 'text-purple-600',
    logo: 'https://cdn.icon-icons.com/icons2/3698/PNG/512/ai_perplexity_logo_icon_230374.png',
    image: '',
  },
  {
    id: 'mistral',
    title: 'Mistral AI',
    description: '法国初创公司开发的高性能开源大语言模型',
    provider: 'Mistral AI',
    category: 'llm',
    url: 'https://mistral.ai',
    icon: 'lucide:wind',
    iconColor: 'text-sky-500',
    logo: 'https://mistral.ai/images/logo.svg',
    image: '',
  },

  // AI编程工具
  {
    id: 'cursor',
    title: 'Cursor',
    description: '基于VSCode的AI编辑器，提供代码生成、解释和重构功能',
    provider: 'Cursor',
    category: 'coding',
    url: 'https://cursor.sh',
    icon: 'vscode-icons:file-type-cursorrules',
    iconColor: 'text-blue-500',
    logo: 'https://cursor.sh/apple-touch-icon.png',
    image: '',
  },
  {
    id: 'github-copilot',
    title: 'GitHub Copilot',
    description: 'GitHub和OpenAI合作开发的AI编程助手，提供代码建议和自动完成',
    provider: 'GitHub',
    category: 'coding',
    url: 'https://github.com/features/copilot',
    icon: 'simple-icons:githubcopilot',
    iconColor: 'text-gray-500',
    logo: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
    image: '',
  },
  {
    id: 'trae',
    title: 'Trae',
    description: '国内出品的第一款桌面端AI IDE，提供智能编程辅助功能',
    provider: 'Trae',
    category: 'coding',
    url: 'https://trae.cn',
    icon: '4agi:trae',
    iconColor: 'text-red-500',
    logo: 'https://trae.cn/favicon.ico',
    image: '',
  },
  {
    id: 'codeium',
    title: 'Codeium',
    description: '免费的AI编码助手，支持多种IDE和编程语言',
    provider: 'Codeium',
    category: 'coding',
    url: 'https://codeium.com',
    icon: 'lucide:code-2',
    iconColor: 'text-green-500',
    logo: 'https://codeium.com/favicon.ico',
    image: '',
  },
  {
    id: 'tabnine',
    title: 'Tabnine',
    description: '基于AI的代码自动完成工具，支持多种编程语言和IDE',
    provider: 'Tabnine',
    category: 'coding',
    url: 'https://www.tabnine.com',
    icon: 'simple-icons:tabnine',
    iconColor: 'text-blue-600',
    logo: 'https://www.tabnine.com/favicon.ico',
    image: '',
  },
  {
    id: 'replit-ghostwriter',
    title: 'Replit Ghostwriter',
    description: 'Replit平台的AI编程助手，提供代码生成和解释功能',
    provider: 'Replit',
    category: 'coding',
    url: 'https://replit.com/ghostwriter',
    icon: 'simple-icons:replit',
    iconColor: 'text-orange-500',
    logo: 'https://replit.com/public/icons/favicon-196.png',
    image: '',
  },
  {
    id: 'amazon-codewhisperer',
    title: 'Amazon CodeWhisperer',
    description: '亚马逊开发的AI编程助手，提供实时代码建议和安全扫描',
    provider: 'Amazon',
    category: 'coding',
    url: 'https://aws.amazon.com/codewhisperer',
    icon: 'simple-icons:amazonaws',
    iconColor: 'text-yellow-600',
    logo: 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico',
    image: '',
  },

  // AI图像生成
  {
    id: 'midjourney',
    title: 'Midjourney',
    description: '基于Discord的AI图像生成工具，以艺术性和创意著称',
    provider: 'Midjourney',
    category: 'image',
    url: 'https://midjourney.com',
    icon: 'simple-icons:midjourney',
    iconColor: 'text-indigo-500',
    logo: 'https://www.midjourney.com/apple-touch-icon.png',
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
  },
  {
    id: 'dall-e',
    title: 'DALL-E 3',
    description: 'OpenAI开发的文本到图像生成模型，能够创建高度详细和准确的图像',
    provider: 'OpenAI',
    category: 'image',
    url: 'https://openai.com/dall-e-3',
    icon: 'simple-icons:openai',
    iconColor: 'text-emerald-500',
    logo: 'https://openai.com/favicon.ico',
    image: 'https://images.unsplash.com/photo-1686191128892-ba4a1635b76c?q=80&w=1000',
  },
  {
    id: 'stable-diffusion',
    title: 'Stable Diffusion',
    description: '开源的文本到图像生成模型，可本地部署和自定义训练',
    provider: 'Stability AI',
    category: 'image',
    url: 'https://stability.ai',
    icon: 'simple-icons:stabilityai',
    iconColor: 'text-yellow-500',
    logo: 'https://stability.ai/favicon.ico',
    image: 'https://images.unsplash.com/photo-1684891002585-a3986c2d02d1?q=80&w=1000',
  },
  {
    id: 'leonardo-ai',
    title: 'Leonardo.AI',
    description: 'AI创意工具平台，提供高质量图像生成和自定义模型训练',
    provider: 'Leonardo.AI',
    category: 'image',
    url: 'https://leonardo.ai',
    icon: 'lucide:palette',
    iconColor: 'text-pink-500',
    logo: 'https://leonardo.ai/favicon.ico',
    image: '',
  },
  {
    id: 'adobe-firefly',
    title: 'Adobe Firefly',
    description: 'Adobe开发的生成式AI创意工具，集成于Creative Cloud套件',
    provider: 'Adobe',
    category: 'image',
    url: 'https://firefly.adobe.com',
    icon: 'simple-icons:adobe',
    iconColor: 'text-red-600',
    logo: 'https://www.adobe.com/favicon.ico',
    image: '',
  },
  {
    id: 'canva-text-to-image',
    title: 'Canva Text to Image',
    description: 'Canva平台集成的AI图像生成工具，适合设计和营销使用',
    provider: 'Canva',
    category: 'image',
    url: 'https://www.canva.com/ai-image-generator',
    icon: 'simple-icons:canva',
    iconColor: 'text-blue-500',
    logo: 'https://www.canva.com/favicon.ico',
    image: '',
  },
  {
    id: 'runway-gen-2',
    title: 'Runway Gen-2',
    description: '先进的图像和视频生成模型，支持文本到图像和图像到图像转换',
    provider: 'Runway',
    category: 'image',
    url: 'https://runwayml.com/ai-magic-tools/gen-2',
    icon: 'simple-icons:runway',
    iconColor: 'text-green-500',
    logo: 'https://runwayml.com/favicon.ico',
    image: '',
  },

  // AI音频和视频
  {
    id: 'elevenlabs',
    title: 'ElevenLabs',
    description: 'AI语音生成和克隆工具，提供逼真的多语言语音合成',
    provider: 'ElevenLabs',
    category: 'audio-video',
    url: 'https://elevenlabs.io',
    icon: 'simple-icons:elevenlabs',
    iconColor: 'text-purple-500',
    logo: 'https://elevenlabs.io/favicon.ico',
    image: '',
  },
  {
    id: 'runway',
    title: 'Runway',
    description: 'AI视频生成和编辑工具，支持文本到视频、图像到视频等功能',
    provider: 'Runway',
    category: 'audio-video',
    url: 'https://runwayml.com',
    icon: 'simple-icons:runway',
    iconColor: 'text-green-500',
    logo: 'https://runwayml.com/favicon.ico',
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1000',
  },
  {
    id: 'synthesia',
    title: 'Synthesia',
    description: 'AI视频生成平台，可从文本创建逼真的数字人视频',
    provider: 'Synthesia',
    category: 'audio-video',
    url: 'https://www.synthesia.io',
    icon: 'lucide:video',
    iconColor: 'text-blue-500',
    logo: 'https://www.synthesia.io/favicon.ico',
    image: '',
  },
  {
    id: 'descript',
    title: 'Descript',
    description: 'AI驱动的音频和视频编辑平台，提供转录、编辑和合成功能',
    provider: 'Descript',
    category: 'audio-video',
    url: 'https://www.descript.com',
    icon: 'lucide:mic',
    iconColor: 'text-red-500',
    logo: 'https://www.descript.com/favicon.ico',
    image: '',
  },
  {
    id: 'murf',
    title: 'Murf AI',
    description: 'AI语音生成平台，提供自然逼真的文本到语音转换',
    provider: 'Murf',
    category: 'audio-video',
    url: 'https://murf.ai',
    icon: 'lucide:volume-2',
    iconColor: 'text-blue-400',
    logo: 'https://murf.ai/favicon.ico',
    image: '',
  },
  {
    id: 'heygen',
    title: 'HeyGen',
    description: 'AI视频生成平台，可创建多语言的数字人视频',
    provider: 'HeyGen',
    category: 'audio-video',
    url: 'https://www.heygen.com',
    icon: 'lucide:video',
    iconColor: 'text-indigo-500',
    logo: 'https://www.heygen.com/favicon.ico',
    image: '',
  },
  {
    id: 'suno',
    title: 'Suno',
    description: 'AI音乐生成工具，可从文本描述创建完整歌曲',
    provider: 'Suno',
    category: 'audio-video',
    url: 'https://suno.ai',
    icon: 'lucide:music',
    iconColor: 'text-pink-500',
    logo: 'https://suno.ai/favicon.ico',
    image: '',
  },

  // AI研究和开发
  {
    id: 'huggingface',
    title: 'Hugging Face',
    description: 'AI社区和模型库，提供开源模型、数据集和工具',
    provider: 'Hugging Face',
    category: 'research',
    url: 'https://huggingface.co',
    icon: 'simple-icons:huggingface',
    iconColor: 'text-yellow-500',
    logo: 'https://huggingface.co/favicon.ico',
    image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?q=80&w=1000',
  },
  {
    id: 'langchain',
    title: 'LangChain',
    description: '开发LLM应用的框架，提供链接外部数据源和API的能力',
    provider: 'LangChain',
    category: 'research',
    url: 'https://www.langchain.com',
    icon: 'simple-icons:langchain',
    iconColor: 'text-green-500',
    logo: 'https://www.langchain.com/favicon.ico',
    image: '',
  },
  {
    id: 'pinecone',
    title: 'Pinecone',
    description: '向量数据库，为AI应用提供高效的相似性搜索和检索',
    provider: 'Pinecone',
    category: 'research',
    url: 'https://www.pinecone.io',
    icon: 'simple-icons:pinecone',
    iconColor: 'text-purple-500',
    logo: 'https://www.pinecone.io/favicon.ico',
    image: '',
  },
  {
    id: 'weights-biases',
    title: 'Weights & Biases',
    description: '机器学习实验跟踪和模型管理平台',
    provider: 'W&B',
    category: 'research',
    url: 'https://wandb.ai',
    icon: 'simple-icons:weightsandbiases',
    iconColor: 'text-yellow-600',
    logo: 'https://wandb.ai/favicon.ico',
    image: '',
  },
  {
    id: 'pytorch',
    title: 'PyTorch',
    description: '开源机器学习框架，广泛用于研究和生产环境',
    provider: 'Meta',
    category: 'research',
    url: 'https://pytorch.org',
    icon: 'simple-icons:pytorch',
    iconColor: 'text-orange-500',
    logo: 'https://pytorch.org/favicon.ico',
    image: '',
  },
  {
    id: 'tensorflow',
    title: 'TensorFlow',
    description: 'Google开发的开源机器学习平台，支持多种应用场景',
    provider: 'Google',
    category: 'research',
    url: 'https://www.tensorflow.org',
    icon: 'simple-icons:tensorflow',
    iconColor: 'text-orange-600',
    logo: 'https://www.tensorflow.org/favicon.ico',
    image: '',
  },
  {
    id: 'cohere',
    title: 'Cohere',
    description: '提供企业级NLP API，用于构建语言理解和生成应用',
    provider: 'Cohere',
    category: 'research',
    url: 'https://cohere.ai',
    icon: 'lucide:braces',
    iconColor: 'text-blue-500',
    logo: 'https://cohere.ai/favicon.ico',
    image: '',
  },
  {
    id: 'modal',
    title: 'Modal',
    description: '云端AI和计算平台，简化大规模AI应用部署',
    provider: 'Modal',
    category: 'research',
    url: 'https://modal.com',
    icon: 'lucide:cloud',
    iconColor: 'text-indigo-500',
    logo: 'https://modal.com/favicon.ico',
    image: '',
  },

  // 新增分类：AI助手和工具
  {
    id: 'notion-ai',
    title: 'Notion AI',
    description: 'Notion集成的AI助手，提供写作、总结和头脑风暴功能',
    provider: 'Notion',
    category: 'assistant',
    url: 'https://www.notion.so/product/ai',
    icon: 'simple-icons:notion',
    iconColor: 'text-gray-600',
    logo: 'https://www.notion.so/favicon.ico',
    image: '',
  },
  {
    id: 'jasper',
    title: 'Jasper',
    description: 'AI内容创作平台，帮助团队创建营销内容和文案',
    provider: 'Jasper',
    category: 'assistant',
    url: 'https://www.jasper.ai',
    icon: 'lucide:pen-tool',
    iconColor: 'text-orange-500',
    logo: 'https://www.jasper.ai/favicon.ico',
    image: '',
  },
  {
    id: 'grammarly',
    title: 'Grammarly',
    description: 'AI写作助手，提供语法检查、拼写纠正和写作建议',
    provider: 'Grammarly',
    category: 'assistant',
    url: 'https://www.grammarly.com',
    icon: 'simple-icons:grammarly',
    iconColor: 'text-green-600',
    logo: 'https://www.grammarly.com/favicon.ico',
    image: '',
  },
  {
    id: 'otter-ai',
    title: 'Otter.ai',
    description: 'AI会议记录和转录工具，实时记录和总结会议内容',
    provider: 'Otter.ai',
    category: 'assistant',
    url: 'https://otter.ai',
    icon: 'lucide:file-text',
    iconColor: 'text-purple-500',
    logo: 'https://otter.ai/favicon.ico',
    image: '',
  },
  {
    id: 'chatpdf',
    title: 'ChatPDF',
    description: '与PDF文档对话的AI工具，快速提取和理解文档内容',
    provider: 'ChatPDF',
    category: 'assistant',
    url: 'https://www.chatpdf.com',
    icon: 'lucide:file-text',
    iconColor: 'text-red-500',
    logo: 'https://www.chatpdf.com/favicon.ico',
    image: '',
  },
  {
    id: 'mem',
    title: 'Mem',
    description: 'AI驱动的工作空间，帮助组织和检索信息',
    provider: 'Mem',
    category: 'assistant',
    url: 'https://mem.ai',
    icon: 'lucide:brain',
    iconColor: 'text-blue-500',
    logo: 'https://mem.ai/favicon.ico',
    image: '',
  },
];

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
  ogImage: config.value.site.ogImage,
  twitterCard: 'summary_large_image',
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
