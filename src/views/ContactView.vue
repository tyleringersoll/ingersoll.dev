<template>
  <section v-if="contactContent" class="contact container">
    <template v-for="(entry, idx) in introContent" :key="idx">
      <Article :article="entry" :index="idx" />
    </template>
    <div class="contact__cards">
      <div
        v-for="(card, idx) in cardContent"
        :key="idx"
        class="contact__card"
      >
        <h3>{{ card.heading }}</h3>
        <p
          v-for="(para, pIdx) in card.content"
          :key="pIdx"
          v-html="para"
        />
        <ul class="contact__links">
          <li v-for="(link, lIdx) in card.links" :key="lIdx">
            <a
              :href="link.url"
              class="contact__link"
              v-bind="link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
            >{{ link.label }}</a>
          </li>
        </ul>
      </div>
    </div>
  </section>
  <section v-else class="container">
    <h1>Page Not Found</h1>
    <p>The requested page could not be found.</p>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useContentStore } from "@/store";
import Article from "@/components/Article.vue";

const store = useContentStore();
const { content, isLoading } = storeToRefs(store);

const contactContent = computed(() => {
  if (isLoading.value || !content.value) return null;
  return content.value.contact ?? null;
});

const introContent = computed(() =>
  contactContent.value?.filter((e) => !e.links) ?? []
);

const cardContent = computed(() =>
  contactContent.value?.filter((e) => e.links) ?? []
);
</script>

<style lang="scss" scoped>
.contact {
  &__cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;

    @include respond-below(sm) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background-color: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: 1rem;
    padding: $spacing-lg;
  }

  &__links {
    list-style: none;
    margin: $spacing-md 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__link {
    font-weight: 600;
  }
}
</style>
