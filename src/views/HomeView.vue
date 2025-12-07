<template>
  <section v-if="content.home" class="home container">
    <transition
      name="fade"
      mode="out-in"
      v-for="(article, index) in content.home"
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
