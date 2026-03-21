import { shallowMount } from "@vue/test-utils";
import MusicViewVue from "@/views/MusicView.vue";

const Article = {
  name: "Article",
  props: ["article", "index"],
  template: "<div>{{ article.title }}</div>",
};

describe("MusicView.vue", () => {

  it("does not render .music container when content.music is undefined", () => {
    const wrapper = shallowMount(MusicViewVue, {
      props: {
        content: {},
      },
      global: {
        components: {
          Article,
        },
      },
    });

    expect(wrapper.find(".music").exists()).toBe(false);
  });

  it("renders Article components when content.music is provided", () => {
    const articles = [
      { title: "Music Article 1" },
      { title: "Music Article 2" },
    ];

    const wrapper = shallowMount(MusicViewVue, {
      props: {
        content: {
          music: articles,
        },
      },
      global: {
        components: {
          Article,
        },
      },
    });

    const articleComponents = wrapper.findAllComponents(Article);

    expect(wrapper.find(".music").exists()).toBe(true);
    expect(articleComponents).toHaveLength(articles.length);

    for (let i = 0; i < articles.length; i++) {
      expect(articleComponents[i].props().article).toEqual(articles[i]);
      expect(articleComponents[i].props().index).toBe(i);
    }
  });

  it("renders the container but no articles when content.music is an empty array", () => {
    const wrapper = shallowMount(MusicViewVue, {
      props: {
        content: {
          music: [],
        },
      },
      global: {
        components: {
          Article,
        },
      },
    });

    expect(wrapper.find(".music").exists()).toBe(true);
    expect(wrapper.findAllComponents(Article)).toHaveLength(0);
  });
});
