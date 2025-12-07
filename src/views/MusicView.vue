<template>
  <section v-if="content.music" class="music container">
    <transition
      name="fade"
      mode="out-in"
      v-for="(article, index) in content.music"
      :key="index"
    >
      <Article :article="article" :index="index" />
    </transition>
  </section>
</template>

<script setup>
defineProps({
  content: {
    type: Object,
    default: () => ({}),
  },
});
</script>
