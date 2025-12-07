const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "~@/styles/abstracts/variables.scss";
          @import "~@/styles/abstracts/mixins.scss";
        `,
      },
    },
  },
});
