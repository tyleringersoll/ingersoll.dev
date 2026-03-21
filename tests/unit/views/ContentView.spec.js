import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { useRoute } from "vue-router";
import ContentView from "@/views/ContentView.vue";
import { useContentStore } from "@/store";

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
}));

jest.mock("@/projects", () => ({
  UntappdBeers: {
    name: "UntappdBeers",
    props: ["sort", "limit", "icons"],
    template: "<div class='untappd-beers' />",
  },
}));

const Article = {
  name: "Article",
  props: ["article", "index"],
  template: "<div class='article'><slot /></div>",
};

const UntappdBeersStub = {
  name: "UntappdBeers",
  props: ["sort", "limit", "icons"],
  template: "<div class='untappd-beers' />",
};

describe("ContentView.vue", () => {
  let pinia;

  const mountView = (routePath = "/", contentOverrides = null) => {
    pinia = createPinia();
    setActivePinia(pinia);

    useRoute.mockReturnValue({ path: routePath });

    const store = useContentStore();
    store.content = contentOverrides;

    return mount(ContentView, {
      global: {
        plugins: [pinia],
        components: { Article, UntappdBeers: UntappdBeersStub },
        stubs: { transition: false },
      },
    });
  };

  beforeEach(() => {
    useRoute.mockReturnValue({ path: "/" });
  });

  it("shows 'Page Not Found' when store.content is null", () => {
    const wrapper = mountView("/", null);
    expect(wrapper.find("h1").text()).toBe("Page Not Found");
  });

  it("shows 'Page Not Found' when route doesn't match any content key", () => {
    const wrapper = mountView("/unknown", { home: [{ heading: "Home" }] });
    expect(wrapper.find("h1").text()).toBe("Page Not Found");
  });

  it("renders content and applies correct CSS class for '/' (home)", () => {
    const wrapper = mountView("/", {
      home: [{ heading: "Welcome" }],
    });
    expect(wrapper.find(".home").exists()).toBe(true);
    expect(wrapper.find("h1").exists()).toBe(false);
  });

  it("renders content and applies correct CSS class for '/music'", () => {
    const wrapper = mountView("/music", {
      music: [{ heading: "Music" }],
    });
    expect(wrapper.find(".music").exists()).toBe(true);
  });

  it("renders UntappdBeers component for articles with component: 'UntappdBeers'", () => {
    const wrapper = mountView("/projects", {
      projects: [{ heading: "Beers", component: "UntappdBeers" }],
    });
    expect(wrapper.find(".untappd-beers").exists()).toBe(true);
  });

  it("does NOT render UntappdBeers for regular articles", () => {
    const wrapper = mountView("/projects", {
      projects: [{ heading: "A Project" }],
    });
    expect(wrapper.find(".untappd-beers").exists()).toBe(false);
  });

  it("renders the correct number of Article components", () => {
    const wrapper = mountView("/", {
      home: [
        { heading: "Article One" },
        { heading: "Article Two" },
        { heading: "Article Three" },
      ],
    });
    expect(wrapper.findAllComponents(Article)).toHaveLength(3);
  });
});
