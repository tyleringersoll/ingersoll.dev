import ContentView from "@/views/ContentView.vue";
import ResumeView from "@/views/ResumeView.vue";
import router, { updateRoutes } from "@/router";

describe("Vue Router", () => {
  it("should have a route for home with ContentView component", () => {
    const homeRoute = router.options.routes.find(route => route.name === "home");
    expect(homeRoute).toBeDefined();
    expect(homeRoute.path).toBe("/");
    expect(homeRoute.component).toBe(ContentView);
  });

  it("should have a not-found catch-all route with ContentView component", () => {
    const notFoundRoute = router.options.routes.find(route => route.name === "not-found");
    expect(notFoundRoute).toBeDefined();
    expect(notFoundRoute.path).toBe("/:pathMatch(.*)*");
    expect(notFoundRoute.component).toBe(ContentView);
  });

  describe("updateRoutes", () => {
    beforeEach(() => {
      // Remove any dynamically added routes before each test
      ["resume", "about", "music"].forEach(name => {
        if (router.hasRoute(name)) router.removeRoute(name);
      });
    });

    it("does nothing when content is null", () => {
      const routesBefore = router.getRoutes().length;
      updateRoutes(null);
      expect(router.getRoutes().length).toBe(routesBefore);
    });

    it("adds routes from content navigation", () => {
      updateRoutes({
        navigation: [
          { name: "About", url: "/about" },
        ],
      });
      expect(router.hasRoute("about")).toBe(true);
    });

    it("maps resume url to ResumeView", () => {
      updateRoutes({
        navigation: [
          { name: "Resume", url: "/resume" },
        ],
      });
      const resumeRoute = router.getRoutes().find(r => r.name === "resume");
      expect(resumeRoute).toBeDefined();
      expect(resumeRoute.components.default).toBe(ResumeView);
    });

    it("maps unknown route names to ContentView", () => {
      updateRoutes({
        navigation: [
          { name: "Music", url: "/music" },
        ],
      });
      const musicRoute = router.getRoutes().find(r => r.name === "music");
      expect(musicRoute).toBeDefined();
      expect(musicRoute.components.default).toBe(ContentView);
    });

    it("skips navigation items without a url", () => {
      const routesBefore = router.getRoutes().length;
      updateRoutes({
        navigation: [
          { name: "No URL" },
        ],
      });
      expect(router.getRoutes().length).toBe(routesBefore);
    });

    it("skips navigation items with root url '/'", () => {
      const routesBefore = router.getRoutes().length;
      updateRoutes({
        navigation: [
          { name: "Home", url: "/" },
        ],
      });
      expect(router.getRoutes().length).toBe(routesBefore);
    });
  });

  describe("scroll behavior", () => {
    const scrollBehavior = router.options.scrollBehavior;

    it("returns { top: 0 } when there is no saved position", () => {
      const result = scrollBehavior({}, {}, null);
      expect(result).toEqual({ top: 0 });
    });

    it("returns the saved position when one exists", () => {
      const savedPosition = { top: 200, left: 0 };
      const result = scrollBehavior({}, {}, savedPosition);
      expect(result).toEqual(savedPosition);
    });
  });
});
