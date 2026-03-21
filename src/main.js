import { createApp } from "vue";
import App from "./App.vue";
import router, { updateRoutes } from "./router";
import { createPinia } from "pinia";
import { useContentStore } from "@/store";
import mediaQueryPlugin from "./plugins/mediaQuery";
import { Header, MobileNav, Navigation, Footer, Article } from "@/components";
import "@/styles/main.scss";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(mediaQueryPlugin);
app.component("Header", Header);
app.component("MobileNav", MobileNav);
app.component("Navigation", Navigation);
app.component("Footer", Footer);
app.component("Article", Article);

const store = useContentStore();
store.loadContent().then(() => {
  if (store.content) {
    updateRoutes(store.content);
  }
  app.use(router);
  app.mount("#app");
});
