<template>
  <div class="app-upper">
    <div class="mobile-header-bar">
      <Header v-if="content.meta" :content="content.meta" />
      <MobileNav
        v-if="mediaQuery.isSmall && content.navigation"
        :content="content.navigation"
        @nav:clicked="onMobileNavClicked"
      />
    </div>
    <Navigation
      v-if="!mediaQuery.isSmall && content.navigation"
      :content="content.navigation"
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
    v-if="content.footer && content.footer.socialHeading"
    class="app-sticky-bottom"
    :content="content.footer"
  />
</template>

<script setup>
import { useContentStore } from "@/store";
import { reactive, inject, computed } from "vue";

const store = useContentStore();
const mediaQuery = inject("mediaQuery");

const mobileNav = reactive({
  isOpen: false,
});

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

const onMobileNavClicked = (value) => {
  mobileNav.isOpen = value;
};
</script>

