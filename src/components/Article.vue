<template>
  <article class="article">
    <component
      v-if="props.article.heading"
      :is="headingLevel"
      :class="{ 'first-heading': props.index === 0 }"
      v-html="props.article.heading"
    />
    <p v-if="inlineStyle" class="article__inline-theme">
      <span
        v-for="(para, paraIndex) in props.article.content"
        :key="paraIndex"
        class="article__inline-item"
      >
        <span class="article__inline" v-html="para" />
        <span
          v-if="props.article.content.length - 1 !== paraIndex"
          class="article__bullet"
          >&bull;</span
        >
      </span>
    </p>
    <p
      v-else
      v-for="(para, paraIndex) in props.article.content"
      :key="paraIndex"
      v-html="para"
    />
    <slot />
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  article: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: -1,
  },
});

const headingLevel = computed(() => {
  return props.article.headingLevel ? `h${props.article.headingLevel}` : "h3";
});

const inlineStyle = computed(() => {
  return props.article.contentStyle && props.article.contentStyle === "inline";
});
</script>

<style lang="scss" scoped>
.article {
  &__inline {
    @include transition-fast(all);

    &:hover {
      color: $color-highlight-1;
      cursor: default;
    }

    &-theme {
      line-height: $line-height-body;
      text-transform: lowercase;
    }

    &-item {
      display: inline-block;
      white-space: nowrap;
    }
  }

  &__bullet {
    margin: 0 0.4rem;
  }
}
</style>
