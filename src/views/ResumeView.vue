<template>
  <section v-if="resumeContent" class="resume container">
    <template v-for="(entry, entryIdx) in resumeContent" :key="entryIdx">
      <Article v-if="!entry.roles" :article="entry" :index="entryIdx" />
      <article v-else class="article employer">
        <component
          :is="`h${entry.headingLevel || 3}`"
          class="employer__name"
          :class="{ 'first-heading': entryIdx === 0 }"
          v-html="entry.heading"
        />
        <template v-for="(role, roleIdx) in entry.roles" :key="roleIdx">
          <div
            class="role__left"
            @click="toggleRole(entryIdx, roleIdx)"
          >
            <span class="role__caret" :class="{ 'role__caret--open': isExpanded(entryIdx, roleIdx) }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
            <span class="role__dates-col">{{ roleDates(role.subheading) }}</span>
          </div>
          <component
            :is="`h${(entry.headingLevel || 3) + 1}`"
            class="role__subheading"
            @click="toggleRole(entryIdx, roleIdx)"
          >{{ roleTitle(role.subheading) }}</component>
          <transition name="role-expand">
            <div v-if="isExpanded(entryIdx, roleIdx)" class="role__content">
              <template v-for="(para, paraIdx) in role.content" :key="paraIdx">
                <hr v-if="para.trim().startsWith('<strong>Tech:')" class="tech-divider" />
                <p
                  :class="{ 'article__bullet-item': para.trim().startsWith('•') }"
                  v-html="para"
                />
              </template>
            </div>
          </transition>
        </template>
      </article>
    </template>
  </section>
  <section v-else class="container">
    <h1>Page Not Found</h1>
    <p>The requested page could not be found.</p>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useContentStore } from "@/store";
import Article from "@/components/Article.vue";

const store = useContentStore();
const { content, isLoading } = storeToRefs(store);

const resumeContent = computed(() => {
  if (isLoading.value || !content.value) return null;
  return content.value.resume ?? null;
});

const expandedRoles = ref(new Set());

const roleTitle = (subheading) => subheading.split(' · ')[0];
const roleDates = (subheading) => subheading.split(' · ')[1] ?? '';

const isExpanded = (entryIdx, roleIdx) =>
  expandedRoles.value.has(`${entryIdx}-${roleIdx}`);

const toggleRole = (entryIdx, roleIdx) => {
  const key = `${entryIdx}-${roleIdx}`;
  const set = new Set(expandedRoles.value);
  if (set.has(key)) {
    set.delete(key);
  } else {
    set.add(key);
  }
  expandedRoles.value = set;
};
</script>

<style lang="scss" scoped>
.employer {
  display: grid;
  grid-template-columns: 9rem 1fr;
  column-gap: $spacing-sm;
  align-items: center;

  @include respond-below(xs) {
    display: block;
  }

  &__name {
    grid-column: 1 / -1;
    margin-bottom: $spacing-md;
  }
}

.role {
  &__left {
    display: flex;
    align-items: center;
    gap: 0.4em;
    margin-bottom: $spacing-xs;
    cursor: pointer;
    user-select: none;

    @include respond-below(xs) {
      display: none;
    }
  }

  &__dates-col {
    font-size: 1rem;
    color: $color-gray-2;
    white-space: nowrap;
    line-height: 1.2;
  }

  &__subheading {
    display: block;
    margin: 0 0 $spacing-xs;
    font-size: 1rem;
    font-weight: 700;
    color: $color-gray-0;
    cursor: pointer;
    user-select: none;
    @include transition(color);

    &:hover {
      color: $color-gray-1;
    }
  }

  &__caret {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: $color-gray-3;
    @include transition(transform);

    &--open {
      transform: rotate(180deg);
    }
  }

  &__content {
    grid-column: 1 / -1;
    background-color: $color-gray-7;
    border: 1px solid $color-gray-5;
    border-radius: 1rem;
    padding: $spacing-sm $spacing-lg;
    margin: $spacing-sm 0 $spacing-md;
  }
}

.tech-divider {
  border: none;
  border-top: 1px solid $color-gray-0;
  margin: $spacing-md 0 $spacing-sm;
}

.article__bullet-item {
  padding-left: 1rem;
  text-indent: -0.5rem;
}

.role-expand {
  &-enter-active,
  &-leave-active {
    transition: max-height 0.3s ease, opacity 0.2s ease;
    overflow: hidden;
    max-height: 2000px;
  }

  &-enter-from,
  &-leave-to {
    max-height: 0;
    opacity: 0;
  }
}
</style>
