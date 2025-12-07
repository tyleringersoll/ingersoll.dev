<template>
  <nav class="navigation">
    <div class="container">
      <ul class="navigation__items">
        <li
          v-for="(item, index) in content"
          :key="index"
          class="navigation__item"
        >
          <router-link :to="item.url" :innerHTML="item.name" />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  content: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.navigation {
  padding-bottom: $spacing-sm;

  @include respond-to(sm) {
    position: sticky;
    top: 0;
    background-color: $color-gray-6;
  }

  &__items {
    display: flex;
    justify-content: space-between;
    gap: $spacing-sm;
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    border-bottom: 2px solid $color-highlight-3;
  }

  &__item {
    display: none;
    margin: 0 0 $spacing-sm 0;
    @include transition(all);

    @include respond-to(sm) {
      display: inline-block;
      margin: 0 $spacing-sm $spacing-sm;
    }

    &::before {
      display: block;
      content: "";
      padding-bottom: $spacing-sm;
      border-top: 2px solid $color-highlight-3;
      transform: scaleX(0);
      transform-origin: 0% 50%;
      @include transition(transform, 250ms, ease-in-out);
    }

    &:hover {
      &::before {
        transform: scaleX(1);
      }
    }
  }

  a {
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    @include text-uppercase;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      color: $color-highlight-1;
    }

    @include focus-visible(3px);
  }

  :deep(.router-link-exact-active) {
    display: inline-block;
    color: $color-highlight-2;

    @include respond-below(sm) {
      pointer-events: none;
      cursor: default;
    }
  }
}
</style>
