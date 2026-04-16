<template>
  <div class="app-upper">
    <Header
      v-if="content.meta"
      :content="content.meta"
      :navigation="content.navigation || []"
    />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :content="content" />
        </transition>
      </router-view>
    </main>
  </div>
  <Footer
    v-if="content.footer && content.footer.socialHeading && $route.path !== '/'"
    class="app-sticky-bottom"
    :content="content.footer"
  />
</template>

<script setup>
import { useContentStore } from "@/store";
import { computed } from "vue";

const store = useContentStore();

const content = computed(() => {
  if (!store.content) {
    return {
      meta: {},
      navigation: [],
      footer: {
        socialHeading: "",
        socialIcons: [],
        legal: [],
      },
    };
  }
  return store.content;
});
</script>
