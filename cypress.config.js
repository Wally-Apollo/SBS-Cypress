
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  downloadsFolder: 'cypress/downloads',
  viewportWidth: 1280,
  viewportHeight: 720,
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 10000000,
  redirectionLimit: 1000,
  e2e: {
    experimentalInteractiveRunEvents: true,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl:"http://localhost:8080",
  },
})
