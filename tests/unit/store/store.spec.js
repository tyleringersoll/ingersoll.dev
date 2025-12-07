import { createPinia } from "pinia";
import { useContentStore } from "@/store";

const mockContent = {
  meta: {
    name: "Test Name",
    tag: "<span>Test Tag</span>",
  },
  navigation: [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ],
  home: [
    {
      heading: "Welcome",
      headingLevel: 2,
      content: ["Welcome content"],
    },
  ],
  development: [],
  projects: [],
  music: [],
  icons: {
    close: "<svg></svg>",
  },
  footer: {
    socialHeading: "Connect",
    socialIcons: [
      {
        svg: "<svg></svg>",
        alt: "Test",
        url: "https://test.com",
      },
    ],
    legal: ["Copyright 2022"],
  },
};

jest.mock("@/data/content.json", () => ({
  content: mockContent,
  default: { content: mockContent },
}));

const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("content store", () => {
  let pinia;

  beforeEach(() => {
    jest.clearAllMocks();
    pinia = createPinia();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("loads content from local JSON file successfully", async () => {
    const store = useContentStore(pinia);
    await store.loadContent();

    expect(store.content).toEqual(mockContent);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe(null);
  });

  it("sets loading state correctly during content load", async () => {
    const store = useContentStore(pinia);
    const loadPromise = store.loadContent();

    expect(store.isLoading).toBe(true);

    await loadPromise;

    expect(store.isLoading).toBe(false);
  });

  it("handles missing content file gracefully", async () => {
    jest.resetModules();
    jest.doMock("@/data/content.json", () => {
      throw new Error("Module not found");
    });

    const store = useContentStore(pinia);
    await store.loadContent();

    expect(store.content).toBe(null);
    expect(store.error).toBeTruthy();
    expect(store.isLoading).toBe(false);
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("handles empty content file", async () => {
    jest.resetModules();
    jest.doMock("@/data/content.json", () => ({
      content: null,
      default: { content: null },
    }));

    const store = useContentStore(pinia);
    await store.loadContent();

    expect(store.content).toBe(null);
    expect(store.error).toBeTruthy();
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("validates content structure and rejects invalid content", async () => {
    jest.resetModules();
    jest.doMock("@/data/content.json", () => ({
      content: { invalid: "structure" },
      default: { content: { invalid: "structure" } },
    }));

    const store = useContentStore(pinia);
    await store.loadContent();

    expect(store.content).toBe(null);
    expect(store.error).toBeTruthy();
    expect(store.error.message).toContain("Missing required content field");
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("validates meta field", async () => {
    jest.resetModules();
    jest.doMock("@/data/content.json", () => ({
      content: {
        meta: {},
        navigation: [],
        footer: { socialHeading: "Test", socialIcons: [] },
      },
      default: {
        content: {
          meta: {},
          navigation: [],
          footer: { socialHeading: "Test", socialIcons: [] },
        },
      },
    }));

    const store = useContentStore(pinia);
    await store.loadContent();

    expect(store.content).toBe(null);
    expect(store.error.message).toContain("name field");
  });

  it("validates navigation is an array", async () => {
    jest.resetModules();
    jest.doMock("@/data/content.json", () => ({
      content: {
        meta: { name: "Test" },
        navigation: "not an array",
        footer: { socialHeading: "Test", socialIcons: [] },
      },
      default: {
        content: {
          meta: { name: "Test" },
          navigation: "not an array",
          footer: { socialHeading: "Test", socialIcons: [] },
        },
      },
    }));

    const store = useContentStore(pinia);
    await store.loadContent();

    expect(store.content).toBe(null);
    expect(store.error.message).toContain("must be an array");
  });

  it("validates footer structure", async () => {
    jest.resetModules();
    jest.doMock("@/data/content.json", () => ({
      content: {
        meta: { name: "Test" },
        navigation: [],
        footer: {},
      },
      default: {
        content: {
          meta: { name: "Test" },
          navigation: [],
          footer: {},
        },
      },
    }));

    const store = useContentStore(pinia);
    await store.loadContent();

    expect(store.content).toBe(null);
    expect(store.error.message).toContain("socialHeading");
  });
});

afterAll(() => {
  mockConsoleError.mockRestore();
});
