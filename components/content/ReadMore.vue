<template>
  <Alert :to :target :icon>
    阅读更多 <span class="font-semibold">{{ computedTitle }}</span>
  </Alert>
</template>

<script setup lang="ts">
const {
  title,
  to,
  icon = 'lucide:bookmark',
} = defineProps<{
  title?: string;
  to: string;
  target?: Target;
  icon?: string;
}>();

const computedTitle = computed<string>(
  () => {
    if (title)
      return title;

    try {
      return useBreadcrumb(to).map(x => x.title).join(' > ');
    } catch {
      return to;
    }
  },
);
</script>
