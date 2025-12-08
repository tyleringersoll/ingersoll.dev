import ContentView from "@/views/ContentView.vue";
import router from "@/router";

describe("Vue Router", () => {
  it("should have a route for home with ContentView component", () => {
    const homeRoute = router.options.routes.find(route => route.name === "home");
    expect(homeRoute).toBeDefined();
    expect(homeRoute.name).toBe("home");
    expect(homeRoute.component).toBe(ContentView);
  });

  it("should have a not-found catch-all route", () => {
    const notFoundRoute = router.options.routes.find(route => route.name === "not-found");
    expect(notFoundRoute).toBeDefined();
    expect(notFoundRoute.path).toBe("/:pathMatch(.*)*");
    expect(notFoundRoute.component).toBe(ContentView);
  });

  it("should use ContentView for all routes", () => {
    router.options.routes.forEach(route => {
      expect(route.component).toBe(ContentView);
    });
  });
});
