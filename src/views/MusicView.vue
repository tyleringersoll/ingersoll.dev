<template>
  <section v-if="musicContent" class="music container">
    <Article
      v-for="(entry, idx) in musicContent.intro"
      :key="`intro-${idx}`"
      :article="entry"
      :index="idx"
    />
    <Timeline>
      <TimelineItem
        v-for="(entry, idx) in musicContent.projects"
        :key="`project-${idx}`"
        :dates="entry.years"
        :title="entry.heading"
        :title-tag="`h${entry.headingLevel}`"
        :title-id="slugify(entry.heading)"
        :expandable="true"
        :expanded="isExpanded(idx)"
        @toggle="toggle(idx)"
      >
        <p
          v-for="(para, pIdx) in entry.content"
          :key="pIdx"
          v-html="para"
        />
      </TimelineItem>
    </Timeline>
  </section>
  <section v-else class="container">
    <h1>Page Not Found</h1>
    <p>The requested page could not be found.</p>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useContentStore } from "@/store";
import Article from "@/components/Article.vue";
import Timeline from "@/components/Timeline.vue";
import TimelineItem from "@/components/TimelineItem.vue";

const route = useRoute();
const expandedSections = ref(new Set());

const slugify = (str) =>
  String(str ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isExpanded = (idx) => expandedSections.value.has(idx);

const toggle = (idx) => {
  const set = new Set(expandedSections.value);
  if (set.has(idx)) {
    set.delete(idx);
  } else {
    set.add(idx);
  }
  expandedSections.value = set;
};

const store = useContentStore();
const { content, isLoading } = storeToRefs(store);

const musicContent = computed(() => {
  if (isLoading.value || !content.value) return null;
  const sections = content.value.music ?? null;
  if (!sections) return null;
  return {
    intro: sections.filter((s) => s.headingLevel <= 2),
    projects: sections.filter((s) => s.headingLevel > 2),
  };
});

const expandSectionForHash = (hash) => {
  if (!hash) return;
  const slug = hash.replace(/^#/, '');
  const projects = musicContent.value?.projects || [];
  const set = new Set(expandedSections.value);
  projects.forEach((entry, idx) => {
    if (slugify(entry.heading) === slug) set.add(idx);
  });
  expandedSections.value = set;
};

const scrollToHash = async (hash) => {
  if (!hash) return;
  await nextTick();
  requestAnimationFrame(() => {
    const el = document.querySelector(hash);
    if (!el) return;
    const nav = document.querySelector('.navigation');
    const navHeight = nav && getComputedStyle(nav).position === 'sticky'
      ? nav.getBoundingClientRect().height
      : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
};

const handleHash = (hash) => {
  expandSectionForHash(hash);
  scrollToHash(hash);
};

onMounted(() => handleHash(route.hash));
watch(() => route.hash, handleHash);
watch(musicContent, () => handleHash(route.hash));
</script>

<style lang="scss" scoped>
.music {
  max-width: 900px;
  padding-bottom: $spacing-xl;
}
</style>
