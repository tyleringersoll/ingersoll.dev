import { defineStore } from "pinia";

export const useContentStore = defineStore("content", {
  state: () => ({
    content: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    async loadContent() {
      this.isLoading = true;
      this.error = null;

      try {
        const jsonData = await import("@/data/content.json");
        const content = jsonData.content || jsonData.default?.content || null;

        if (!content) {
          throw new Error("Content file is empty or malformed");
        }

        this.validateContent(content);
        this.content = content;
      } catch (error) {
        console.error("Failed to load content:", error);
        this.error = error;
        this.content = null;
      } finally {
        this.isLoading = false;
      }
    },

    validateContent(content) {
      if (!content || typeof content !== "object") {
        throw new Error("Content must be an object");
      }

      const requiredFields = ["meta", "navigation", "footer"];
      for (const field of requiredFields) {
        if (!content[field]) {
          throw new Error(`Missing required content field: ${field}`);
        }
      }

      if (!content.meta.name) {
        throw new Error("Content meta must have a name field");
      }

      if (!Array.isArray(content.navigation)) {
        throw new Error("Content navigation must be an array");
      }

      if (!content.footer.socialHeading || !Array.isArray(content.footer.socialIcons)) {
        throw new Error("Content footer must have socialHeading and socialIcons array");
      }
    },
  },
});
