<template>
  <div v-if="page.prevNext ?? true" class="border-t pt-6 lg:flex lg:flex-row">
    <LayoutPrevNextButton :prev-next="filteredPrev" side="left" />
    <span class="flex-1" />
    <LayoutPrevNextButton :prev-next="filteredNext" side="right" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  path: string
}>();

const { page } = useContent();
const { prev, next } = useContent();

// 使用传入的 dir 属性过滤前后页面
const filteredPrev = computed(() => 
  prev.value?._path?.startsWith(props.path) ? prev.value : null
);

const filteredNext = computed(() => 
  next.value?._path?.startsWith(props.path) ? next.value : null
);
</script>
